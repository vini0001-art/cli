import { Lexer, type Token, TokenType } from "./lexer.js"
import type { ASTNode, PageNode, ComponentNode, StateNode, EventNode } from "./ast.js"

export class Parser {
  private lexer: Lexer
  private currentToken: Token
  private peekToken: Token

  constructor(input: string) {
    this.lexer = new Lexer(input)
    this.currentToken = this.lexer.nextToken()
    this.peekToken = this.lexer.nextToken()
  }

  private nextToken(): void {
    this.currentToken = this.peekToken
    this.peekToken = this.lexer.nextToken()
  }

  private expectToken(tokenType: TokenType): Token {
    if (this.currentToken.type !== tokenType) {
      throw new Error(`Expected ${tokenType}, got ${this.currentToken.type}`)
    }
    const token = this.currentToken
    this.nextToken()
    return token
  }

  public parse(): ASTNode[] {
    const nodes: ASTNode[] = []

    while (this.currentToken.type !== TokenType.EOF) {
      const node = this.parseStatement()
      if (node) {
        nodes.push(node)
      }
    }

    return nodes
  }

  private parseStatement(): ASTNode | null {
    switch (this.currentToken.type) {
      case TokenType.PAGE:
        return this.parsePage()
      case TokenType.COMPONENT:
        return this.parseComponent()
      default:
        this.nextToken()
        return null
    }
  }

  private parsePage(): PageNode {
    this.expectToken(TokenType.PAGE)
    const name = this.expectToken(TokenType.IDENTIFIER).value
    this.expectToken(TokenType.LBRACE)

    const body: ASTNode[] = []
    while (this.currentToken.type !== TokenType.RBRACE && this.currentToken.type !== TokenType.EOF) {
      const node = this.parsePageBody()
      if (node) {
        body.push(node)
      }
    }

    this.expectToken(TokenType.RBRACE)

    return {
      type: "Page",
      name,
      body,
    }
  }

  private parseComponent(): ComponentNode {
    this.expectToken(TokenType.COMPONENT)
    const name = this.expectToken(TokenType.IDENTIFIER).value
    this.expectToken(TokenType.LBRACE)

    const body: ASTNode[] = []
    while (this.currentToken.type !== TokenType.RBRACE && this.currentToken.type !== TokenType.EOF) {
      const node = this.parsePageBody()
      if (node) {
        body.push(node)
      }
    }

    this.expectToken(TokenType.RBRACE)

    return {
      type: "Component",
      name,
      body,
    }
  }

  private parsePageBody(): ASTNode | null {
    switch (this.currentToken.type) {
      case TokenType.STATE:
        return this.parseState()
      case TokenType.EVENT:
        return this.parseEvent()
      default:
        this.nextToken()
        return null
    }
  }

  private parseState(): StateNode {
    this.expectToken(TokenType.STATE)
    this.expectToken(TokenType.LBRACE)

    const variables: { name: string; type: string; value: string }[] = []

    while (this.currentToken.type !== TokenType.RBRACE && this.currentToken.type !== TokenType.EOF) {
      if (this.currentToken.type === TokenType.IDENTIFIER) {
        const name = this.currentToken.value
        this.nextToken()
        this.expectToken(TokenType.COLON)
        const type = this.expectToken(TokenType.IDENTIFIER).value
        this.expectToken(TokenType.ASSIGN)
        const value = this.expectToken(TokenType.STRING).value

        variables.push({ name, type, value })
      } else {
        this.nextToken()
      }
    }

    this.expectToken(TokenType.RBRACE)

    return {
      type: "State",
      variables,
    }
  }

  private parseEvent(): EventNode {
    this.expectToken(TokenType.EVENT)
    const name = this.expectToken(TokenType.IDENTIFIER).value
    this.expectToken(TokenType.LPAREN)
    this.expectToken(TokenType.RPAREN)
    this.expectToken(TokenType.LBRACE)

    let body = ""
    let braceCount = 1

    while (braceCount > 0 && this.currentToken.type !== TokenType.EOF) {
      if (this.currentToken.type === TokenType.LBRACE) {
        braceCount++
      } else if (this.currentToken.type === TokenType.RBRACE) {
        braceCount--
      }

      if (braceCount > 0) {
        body += this.currentToken.value + " "
      }

      this.nextToken()
    }

    return {
      type: "Event",
      name,
      body: body.trim(),
    }
  }
}
