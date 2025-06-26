import { TokenType, Lexer, Token } from "./lexer.js"
import * as AST from "./ast.js"

export class Parser {
  private tokens: Token[]
  private current = 0

  constructor(input: string) {
    const lexer = new Lexer(input)
    this.tokens = lexer.tokenize()
  }

  private peek(offset = 0): Token {
    const index = this.current + offset
    return index >= this.tokens.length ? this.tokens[this.tokens.length - 1] : this.tokens[index]
  }

  private advance(): Token {
    if (this.current < this.tokens.length - 1) {
      this.current++
    }
    return this.tokens[this.current - 1]
  }

  private match(...types: TokenType[]): boolean {
    return types.includes(this.peek().type)
  }

  private consume(type: TokenType, message?: string): Token {
    if (this.peek().type === type) {
      return this.advance()
    }

    const token = this.peek()
    throw new Error(message || `Expected ${type}, got ${token.type} at line ${token.line}, column ${token.column}`)
  }

  private skipNewlines(): void {
    while (this.match(TokenType.NEWLINE)) {
      this.advance()
    }
  }

  public parse(): AST.Program {
    const body: AST.Statement[] = []

    this.skipNewlines()

    while (!this.match(TokenType.EOF)) {
      const stmt = this.parseStatement()
      if (stmt) {
        body.push(stmt)
      }
      this.skipNewlines()
    }

    return {
      type: "Program",
      body,
    }
  }

  private parseStatement(): AST.Statement | null {
    this.skipNewlines()

    if (this.match(TokenType.IMPORT)) {
      return this.parseImportStatement()
    }

    if (this.match(TokenType.EXPORT)) {
      return this.parseExportStatement()
    }

    if (this.match(TokenType.COMPONENT)) {
      return this.parseComponentDeclaration()
    }

    if (this.match(TokenType.PAGE)) {
      return this.parsePageDeclaration()
    }

    if (this.match(TokenType.LAYOUT)) {
      return this.parseLayoutDeclaration()
    }

    if (this.match(TokenType.IF)) {
      return this.parseConditionalStatement()
    }

    if (this.match(TokenType.FOR)) {
      return this.parseForStatement()
    }

    // Skip newlines and try again
    if (this.match(TokenType.NEWLINE)) {
      this.advance()
      return null
    }

    throw new Error(`Unexpected token: ${this.peek().type} at line ${this.peek().line}`)
  }

  private parseImportStatement(): AST.ImportStatement {
    this.consume(TokenType.IMPORT)

    const specifiers: AST.ImportSpecifier[] = []

    if (this.match(TokenType.LEFT_BRACE)) {
      this.advance() // {

      do {
        const imported = this.consume(TokenType.IDENTIFIER).value
        let local = imported

        if (this.match(TokenType.IDENTIFIER) && this.peek().value === "as") {
          this.advance() // as
          local = this.consume(TokenType.IDENTIFIER).value
        }

        specifiers.push({
          type: "ImportSpecifier",
          imported,
          local,
        })

        if (this.match(TokenType.COMMA)) {
          this.advance()
        } else {
          break
        }
      } while (!this.match(TokenType.RIGHT_BRACE))

      this.consume(TokenType.RIGHT_BRACE)
    } else {
      const name = this.consume(TokenType.IDENTIFIER).value
      specifiers.push({
        type: "ImportSpecifier",
        imported: "default",
        local: name,
      })
    }

    this.consume(TokenType.FROM)
    const source = this.consume(TokenType.STRING).value

    return {
      type: "ImportStatement",
      specifiers,
      source,
    }
  }

  private parseExportStatement(): AST.ExportStatement {
    this.consume(TokenType.EXPORT)

    let declaration: AST.ComponentDeclaration | AST.PageDeclaration | AST.LayoutDeclaration

    if (this.match(TokenType.COMPONENT)) {
      declaration = this.parseComponentDeclaration()
    } else if (this.match(TokenType.PAGE)) {
      declaration = this.parsePageDeclaration()
    } else if (this.match(TokenType.LAYOUT)) {
      declaration = this.parseLayoutDeclaration()
    } else {
      throw new Error(`Expected component, page, or layout after export at line ${this.peek().line}`)
    }

    return {
      type: "ExportStatement",
      declaration,
    }
  }

  private parseComponentDeclaration(): AST.ComponentDeclaration {
    this.consume(TokenType.COMPONENT)
    const name = this.consume(TokenType.IDENTIFIER).value

    this.consume(TokenType.LEFT_BRACE)
    this.skipNewlines()

    const props: AST.PropDeclaration[] = []
    const state: AST.StateDeclaration[] = []
    const events: AST.EventDeclaration[] = []

    while (!this.match(TokenType.RIGHT_BRACE)) {
      if (this.match(TokenType.PROPS)) {
        props.push(...this.parsePropsSection())
      } else if (this.match(TokenType.STATE)) {
        state.push(...this.parseStateSection())
      } else if (this.match(TokenType.EVENT)) {
        events.push(this.parseEventDeclaration())
      } else {
        break
      }
      this.skipNewlines()
    }

    const body = this.parseJSXElement()
    this.skipNewlines()
    this.consume(TokenType.RIGHT_BRACE)

    return {
      type: "ComponentDeclaration",
      name,
      props,
      state,
      events,
      body,
    }
  }

  private parsePageDeclaration(): AST.PageDeclaration {
    this.consume(TokenType.PAGE)
    const name = this.consume(TokenType.IDENTIFIER).value

    this.consume(TokenType.LEFT_BRACE)
    this.skipNewlines()

    const props: AST.PropDeclaration[] = []
    const state: AST.StateDeclaration[] = []
    const events: AST.EventDeclaration[] = []

    while (!this.match(TokenType.RIGHT_BRACE)) {
      if (this.match(TokenType.PROPS)) {
        props.push(...this.parsePropsSection())
      } else if (this.match(TokenType.STATE)) {
        state.push(...this.parseStateSection())
      } else if (this.match(TokenType.EVENT)) {
        events.push(this.parseEventDeclaration())
      } else {
        break
      }
      this.skipNewlines()
    }

    const body = this.parseJSXElement()
    this.skipNewlines()
    this.consume(TokenType.RIGHT_BRACE)

    return {
      type: "PageDeclaration",
      name,
      props,
      state,
      events,
      body,
    }
  }

  private parseLayoutDeclaration(): AST.LayoutDeclaration {
    this.consume(TokenType.LAYOUT)
    const name = this.consume(TokenType.IDENTIFIER).value

    this.consume(TokenType.LEFT_BRACE)
    this.skipNewlines()

    const props: AST.PropDeclaration[] = []
    const state: AST.StateDeclaration[] = []
    const events: AST.EventDeclaration[] = []

    while (!this.match(TokenType.RIGHT_BRACE)) {
      if (this.match(TokenType.PROPS)) {
        props.push(...this.parsePropsSection())
      } else if (this.match(TokenType.STATE)) {
        state.push(...this.parseStateSection())
      } else if (this.match(TokenType.EVENT)) {
        events.push(this.parseEventDeclaration())
      } else {
        break
      }
      this.skipNewlines()
    }

    const body = this.parseJSXElement()
    this.skipNewlines()
    this.consume(TokenType.RIGHT_BRACE)

    return {
      type: "LayoutDeclaration",
      name,
      props,
      state,
      events,
      body,
    }
  }

  private parsePropsSection(): AST.PropDeclaration[] {
    this.consume(TokenType.PROPS)
    this.consume(TokenType.LEFT_BRACE)
    this.skipNewlines()

    const props: AST.PropDeclaration[] = []

    while (!this.match(TokenType.RIGHT_BRACE)) {
      const name = this.consume(TokenType.IDENTIFIER).value
      this.consume(TokenType.COLON)
      const dataType = this.consume(TokenType.IDENTIFIER).value

      let defaultValue: AST.Expression | undefined
      if (this.match(TokenType.ASSIGN)) {
        this.advance()
        defaultValue = this.parseExpression()
      }

      props.push({
        type: "PropDeclaration",
        name,
        dataType,
        defaultValue,
      })

      if (this.match(TokenType.COMMA)) {
        this.advance()
      }
      this.skipNewlines()
    }

    this.consume(TokenType.RIGHT_BRACE)
    return props
  }

  private parseStateSection(): AST.StateDeclaration[] {
    this.consume(TokenType.STATE)
    this.consume(TokenType.LEFT_BRACE)
    this.skipNewlines()

    const state: AST.StateDeclaration[] = []

    while (!this.match(TokenType.RIGHT_BRACE)) {
      const name = this.consume(TokenType.IDENTIFIER).value
      this.consume(TokenType.COLON)
      const dataType = this.consume(TokenType.IDENTIFIER).value
      this.consume(TokenType.ASSIGN)
      const initialValue = this.parseExpression()

      state.push({
        type: "StateDeclaration",
        name,
        dataType,
        initialValue,
      })

      if (this.match(TokenType.COMMA)) {
        this.advance()
      }
      this.skipNewlines()
    }

    this.consume(TokenType.RIGHT_BRACE)
    return state
  }

  private parseEventDeclaration(): AST.EventDeclaration {
    this.consume(TokenType.EVENT)
    const name = this.consume(TokenType.IDENTIFIER).value

    this.consume(TokenType.LEFT_PAREN)
    const parameters: AST.Parameter[] = []

    while (!this.match(TokenType.RIGHT_PAREN)) {
      const paramName = this.consume(TokenType.IDENTIFIER).value
      this.consume(TokenType.COLON)
      const dataType = this.consume(TokenType.IDENTIFIER).value

      parameters.push({
        type: "Parameter",
        name: paramName,
        dataType,
      })

      if (this.match(TokenType.COMMA)) {
        this.advance()
      }
    }

    this.consume(TokenType.RIGHT_PAREN)
    this.consume(TokenType.LEFT_BRACE)
    this.skipNewlines()

    const body: AST.Statement[] = []
    // For simplicity, we'll skip parsing the event body for now

    this.consume(TokenType.RIGHT_BRACE)

    return {
      type: "EventDeclaration",
      name,
      parameters,
      body,
    }
  }

  private parseJSXElement(): AST.JSXElement {
    this.consume(TokenType.JSX_OPEN)
    const tagName = this.consume(TokenType.IDENTIFIER).value

    const attributes: AST.JSXAttribute[] = []

    while (!this.match(TokenType.JSX_CLOSE, TokenType.JSX_SELF_CLOSE)) {
      const attrName = this.consume(TokenType.IDENTIFIER).value
      this.consume(TokenType.ASSIGN)

      let value: AST.Expression | string
      if (this.match(TokenType.STRING)) {
        value = this.advance().value
      } else if (this.match(TokenType.LEFT_BRACE)) {
        this.advance()
        value = this.parseExpression()
        this.consume(TokenType.RIGHT_BRACE)
      } else {
        throw new Error(`Expected string or expression for attribute value at line ${this.peek().line}`)
      }

      attributes.push({
        type: "JSXAttribute",
        name: attrName,
        value,
      })
    }

    if (this.match(TokenType.JSX_SELF_CLOSE)) {
      this.advance()
      return {
        type: "JSXElement",
        tagName,
        attributes,
        children: [],
        selfClosing: true,
      }
    }

    this.consume(TokenType.JSX_CLOSE)

    const children: (AST.JSXElement | AST.JSXText | AST.JSXExpression)[] = []

    while (!this.match(TokenType.JSX_END_OPEN)) {
      if (this.match(TokenType.JSX_OPEN)) {
        children.push(this.parseJSXElement())
      } else if (this.match(TokenType.LEFT_BRACE)) {
        this.advance()
        const expression = this.parseExpression()
        this.consume(TokenType.RIGHT_BRACE)
        children.push({
          type: "JSXExpression",
          expression,
        })
      } else {
        // Parse text content
        let text = ""
        while (!this.match(TokenType.JSX_OPEN, TokenType.JSX_END_OPEN, TokenType.LEFT_BRACE, TokenType.EOF)) {
          text += this.advance().value
        }
        if (text.trim()) {
          children.push({
            type: "JSXText",
            value: text.trim(),
          })
        }
      }
    }

    this.consume(TokenType.JSX_END_OPEN)
    this.consume(TokenType.IDENTIFIER) // Should match opening tag
    this.consume(TokenType.JSX_CLOSE)

    return {
      type: "JSXElement",
      tagName,
      attributes,
      children,
      selfClosing: false,
    }
  }

  private parseExpression(): AST.Expression {
    return this.parseBinaryExpression()
  }

  private parseBinaryExpression(): AST.Expression {
    let left = this.parsePrimaryExpression()

    while (
      this.match(
        TokenType.PLUS,
        TokenType.MINUS,
        TokenType.MULTIPLY,
        TokenType.DIVIDE,
        TokenType.EQUALS,
        TokenType.NOT_EQUALS,
      )
    ) {
      const operator = this.advance().value
      const right = this.parsePrimaryExpression()

      left = {
        type: "BinaryExpression",
        left,
        operator,
        right,
      } as AST.BinaryExpression
    }

    return left
  }

  private parsePrimaryExpression(): AST.Expression {
    if (this.match(TokenType.IDENTIFIER)) {
      const name = this.advance().value

      if (this.match(TokenType.LEFT_PAREN)) {
        // Function call
        this.advance()
        const args: AST.Expression[] = []

        while (!this.match(TokenType.RIGHT_PAREN)) {
          args.push(this.parseExpression())
          if (this.match(TokenType.COMMA)) {
            this.advance()
          }
        }

        this.consume(TokenType.RIGHT_PAREN)

        return {
          type: "CallExpression",
          callee: { type: "Identifier", name } as AST.Identifier,
          arguments: args,
        } as AST.CallExpression
      }

      return { type: "Identifier", name } as AST.Identifier
    }

    if (this.match(TokenType.STRING)) {
      const value = this.advance().value
      return { type: "Literal", value, raw: `"${value}"` } as AST.Literal
    }

    if (this.match(TokenType.NUMBER)) {
      const raw = this.advance().value
      const value = Number.parseFloat(raw)
      return { type: "Literal", value, raw } as AST.Literal
    }

    if (this.match(TokenType.BOOLEAN)) {
      const raw = this.advance().value
      const value = raw === "true"
      return { type: "Literal", value, raw } as AST.Literal
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      this.advance()
      const expr = this.parseExpression()
      this.consume(TokenType.RIGHT_PAREN)
      return expr
    }

    throw new Error(`Unexpected token in expression: ${this.peek().type} at line ${this.peek().line}`)
  }

  private parseConditionalStatement(): AST.ConditionalStatement {
    this.consume(TokenType.IF)
    this.consume(TokenType.LEFT_PAREN)
    const test = this.parseExpression()
    this.consume(TokenType.RIGHT_PAREN)
    this.consume(TokenType.LEFT_BRACE)

    const consequent: AST.Statement[] = []
    while (!this.match(TokenType.RIGHT_BRACE)) {
      const stmt = this.parseStatement()
      if (stmt) consequent.push(stmt)
    }
    this.consume(TokenType.RIGHT_BRACE)

    let alternate: AST.Statement[] | undefined
    if (this.match(TokenType.ELSE)) {
      this.advance()
      this.consume(TokenType.LEFT_BRACE)
      alternate = []
      while (!this.match(TokenType.RIGHT_BRACE)) {
        const stmt = this.parseStatement()
        if (stmt) alternate.push(stmt)
      }
      this.consume(TokenType.RIGHT_BRACE)
    }

    return {
      type: "ConditionalStatement",
      test,
      consequent,
      alternate,
    }
  }

  private parseForStatement(): AST.ForStatement {
    this.consume(TokenType.FOR)
    this.consume(TokenType.LEFT_PAREN)
    const variable = this.consume(TokenType.IDENTIFIER).value
    this.consume(TokenType.IN)
    const iterable = this.parseExpression()
    this.consume(TokenType.RIGHT_PAREN)
    this.consume(TokenType.LEFT_BRACE)

    const body: AST.Statement[] = []
    while (!this.match(TokenType.RIGHT_BRACE)) {
      const stmt = this.parseStatement()
      if (stmt) body.push(stmt)
    }
    this.consume(TokenType.RIGHT_BRACE)

    return {
      type: "ForStatement",
      variable,
      iterable,
      body,
    }
  }
}
