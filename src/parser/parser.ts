import { Lexer, type Token, TokenType } from "./lexer.js"
import type * as AST from "./ast.js"

export class Parser {
  private lexer: Lexer
  private currentToken: Token
  private peekToken: Token

  constructor(input: string) {
    this.lexer = new Lexer(input)
    this.nextToken()
    this.nextToken()
  }

  private nextToken(): void {
    this.currentToken = this.peekToken
    this.peekToken = this.lexer.nextToken()
  }

  private currentTokenIs(tokenType: TokenType): boolean {
    return this.currentToken.type === tokenType
  }

  private peekTokenIs(tokenType: TokenType): boolean {
    return this.peekToken.type === tokenType
  }

  private expectPeek(tokenType: TokenType): boolean {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken()
      return true
    }
    return false
  }

  public parse(): AST.Program {
    const program: AST.Program = {
      type: "Program",
      body: [],
    }

    while (!this.currentTokenIs(TokenType.EOF)) {
      const stmt = this.parseStatement()
      if (stmt) {
        program.body.push(stmt)
      }
      this.nextToken()
    }

    return program
  }

  private parseStatement(): AST.Node | null {
    switch (this.currentToken.type) {
      case TokenType.COMPONENT:
        return this.parseComponentDeclaration()
      case TokenType.PAGE:
        return this.parsePageDeclaration()
      case TokenType.LAYOUT:
        return this.parseLayoutDeclaration()
      default:
        return null
    }
  }

  private parseComponentDeclaration(): AST.ComponentDeclaration {
    const component: AST.ComponentDeclaration = {
      type: "ComponentDeclaration",
      name: "",
      props: [],
      state: [],
      events: [],
      body: "",
    }

    if (!this.expectPeek(TokenType.IDENT)) {
      return component
    }

    component.name = this.currentToken.literal

    if (!this.expectPeek(TokenType.LBRACE)) {
      return component
    }

    // Parse component body
    while (!this.currentTokenIs(TokenType.RBRACE) && !this.currentTokenIs(TokenType.EOF)) {
      if (this.currentTokenIs(TokenType.PROPS)) {
        component.props = this.parseProps()
      } else if (this.currentTokenIs(TokenType.STATE)) {
        component.state = this.parseState()
      } else if (this.currentTokenIs(TokenType.EVENT)) {
        const event = this.parseEvent()
        if (event) component.events.push(event)
      } else if (this.currentTokenIs(TokenType.LT)) {
        component.body = this.parseJSX()
        break
      }
      this.nextToken()
    }

    return component
  }

  private parsePageDeclaration(): AST.PageDeclaration {
    const page: AST.PageDeclaration = {
      type: "PageDeclaration",
      name: "",
      state: [],
      events: [],
      body: "",
    }

    if (!this.expectPeek(TokenType.IDENT)) {
      return page
    }

    page.name = this.currentToken.literal

    if (!this.expectPeek(TokenType.LBRACE)) {
      return page
    }

    // Parse page body (similar to component but without props)
    while (!this.currentTokenIs(TokenType.RBRACE) && !this.currentTokenIs(TokenType.EOF)) {
      if (this.currentTokenIs(TokenType.STATE)) {
        page.state = this.parseState()
      } else if (this.currentTokenIs(TokenType.EVENT)) {
        const event = this.parseEvent()
        if (event) page.events.push(event)
      } else if (this.currentTokenIs(TokenType.LT)) {
        page.body = this.parseJSX()
        break
      }
      this.nextToken()
    }

    return page
  }

  private parseLayoutDeclaration(): AST.LayoutDeclaration {
    const layout: AST.LayoutDeclaration = {
      type: "LayoutDeclaration",
      name: "",
      props: [],
      body: "",
    }

    if (!this.expectPeek(TokenType.IDENT)) {
      return layout
    }

    layout.name = this.currentToken.literal

    if (!this.expectPeek(TokenType.LBRACE)) {
      return layout
    }

    // Parse layout body
    while (!this.currentTokenIs(TokenType.RBRACE) && !this.currentTokenIs(TokenType.EOF)) {
      if (this.currentTokenIs(TokenType.PROPS)) {
        layout.props = this.parseProps()
      } else if (this.currentTokenIs(TokenType.LT)) {
        layout.body = this.parseJSX()
        break
      }
      this.nextToken()
    }

    return layout
  }

  private parseProps(): AST.PropDeclaration[] {
    const props: AST.PropDeclaration[] = []

    if (!this.expectPeek(TokenType.LBRACE)) {
      return props
    }

    while (!this.currentTokenIs(TokenType.RBRACE) && !this.currentTokenIs(TokenType.EOF)) {
      if (this.currentTokenIs(TokenType.IDENT)) {
        const prop: AST.PropDeclaration = {
          name: this.currentToken.literal,
          type: "any",
          defaultValue: null,
        }

        // Check for type annotation
        if (this.peekTokenIs(TokenType.COLON)) {
          this.nextToken() // consume ':'
          this.nextToken() // get type
          prop.type = this.currentToken.literal
        }

        // Check for default value
        if (this.peekTokenIs(TokenType.ASSIGN)) {
          this.nextToken() // consume '='
          this.nextToken() // get value
          prop.defaultValue = this.currentToken.literal
        }

        props.push(prop)
      }
      this.nextToken()
    }

    return props
  }

  private parseState(): AST.StateDeclaration[] {
    const state: AST.StateDeclaration[] = []

    if (!this.expectPeek(TokenType.LBRACE)) {
      return state
    }

    while (!this.currentTokenIs(TokenType.RBRACE) && !this.currentTokenIs(TokenType.EOF)) {
      if (this.currentTokenIs(TokenType.IDENT)) {
        const stateVar: AST.StateDeclaration = {
          name: this.currentToken.literal,
          type: "any",
          defaultValue: null,
        }

        // Check for type annotation
        if (this.peekTokenIs(TokenType.COLON)) {
          this.nextToken() // consume ':'
          this.nextToken() // get type
          stateVar.type = this.currentToken.literal
        }

        // Check for default value
        if (this.peekTokenIs(TokenType.ASSIGN)) {
          this.nextToken() // consume '='
          this.nextToken() // get value
          stateVar.defaultValue = this.currentToken.literal
        }

        state.push(stateVar)
      }
      this.nextToken()
    }

    return state
  }

  private parseEvent(): AST.EventDeclaration | null {
    if (!this.expectPeek(TokenType.IDENT)) {
      return null
    }

    const event: AST.EventDeclaration = {
      name: this.currentToken.literal,
      body: "",
    }

    // Skip function parentheses and body for now
    // In a real implementation, we'd parse the function body
    if (this.expectPeek(TokenType.LPAREN)) {
      // Skip to closing paren
      while (!this.currentTokenIs(TokenType.RPAREN) && !this.currentTokenIs(TokenType.EOF)) {
        this.nextToken()
      }

      if (this.expectPeek(TokenType.LBRACE)) {
        // Parse function body (simplified)
        let braceCount = 1
        const bodyTokens: string[] = []

        while (braceCount > 0 && !this.currentTokenIs(TokenType.EOF)) {
          this.nextToken()
          if (this.currentTokenIs(TokenType.LBRACE)) {
            braceCount++
          } else if (this.currentTokenIs(TokenType.RBRACE)) {
            braceCount--
          }

          if (braceCount > 0) {
            bodyTokens.push(this.currentToken.literal)
          }
        }

        event.body = bodyTokens.join(" ")
      }
    }

    return event
  }

  private parseJSX(): string {
    // Simplified JSX parsing - in a real implementation this would be much more complex
    const jsxTokens: string[] = []
    let tagCount = 0

    while (!this.currentTokenIs(TokenType.EOF)) {
      if (this.currentTokenIs(TokenType.LT)) {
        tagCount++
      } else if (this.currentTokenIs(TokenType.GT)) {
        tagCount--
      }

      jsxTokens.push(this.currentToken.literal)

      if (tagCount === 0 && jsxTokens.length > 0) {
        break
      }

      this.nextToken()
    }

    return jsxTokens.join("")
  }
}
