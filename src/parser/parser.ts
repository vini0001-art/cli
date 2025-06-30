import { type Token, TokenType, Lexer } from "./lexer.js"
import type {
  PageNode,
  ComponentNode,
  StateNode,
  EventNode,
  JSXElement,
  JSXAttribute,
  JSXText,
  JSXExpression,
  StateProperty,
  PropsNode,
  PropsProperty,
  S4FTNode,
} from "./ast.js"

export class Parser {
  private tokens: Token[]
  private current = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parse(): S4FTNode {
    const token = this.peek()

    if (token.type === TokenType.PAGE) {
      return this.parsePage()
    } else if (token.type === TokenType.COMPONENT) {
      return this.parseComponent()
    }

    throw new Error(`Unexpected token: ${token.type} at line ${token.line}`)
  }

  private parsePage(): PageNode {
    this.consume(TokenType.PAGE)
    const name = this.consume(TokenType.IDENTIFIER).value
    this.consume(TokenType.LBRACE)

    let state: StateNode | undefined
    const events: EventNode[] = []
    let jsx: JSXElement | undefined

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.check(TokenType.STATE)) {
        state = this.parseState()
      } else if (this.check(TokenType.EVENT)) {
        events.push(this.parseEvent())
      } else if (this.check(TokenType.JSX_OPEN)) {
        jsx = this.parseJSXElement()
      } else {
        this.advance()
      }
    }

    this.consume(TokenType.RBRACE)

    if (!jsx) {
      throw new Error("Page must have JSX content")
    }

    return {
      type: "Page",
      name,
      state,
      events,
      jsx,
    }
  }

  private parseComponent(): ComponentNode {
    this.consume(TokenType.COMPONENT)
    const name = this.consume(TokenType.IDENTIFIER).value

    // Parse props if present
    let props: PropsNode | undefined
    if (this.check(TokenType.LPAREN)) {
      props = this.parseProps()
    }

    this.consume(TokenType.LBRACE)

    let state: StateNode | undefined
    const events: EventNode[] = []
    let jsx: JSXElement | undefined

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.check(TokenType.STATE)) {
        state = this.parseState()
      } else if (this.check(TokenType.EVENT)) {
        events.push(this.parseEvent())
      } else if (this.check(TokenType.JSX_OPEN)) {
        jsx = this.parseJSXElement()
      } else {
        this.advance()
      }
    }

    this.consume(TokenType.RBRACE)

    if (!jsx) {
      throw new Error("Component must have JSX content")
    }

    return {
      type: "Component",
      name,
      props,
      state,
      events,
      jsx,
    }
  }

  private parseProps(): PropsNode {
    this.consume(TokenType.LPAREN)

    const properties: PropsProperty[] = []

    if (!this.check(TokenType.RPAREN)) {
      do {
        const name = this.consume(TokenType.IDENTIFIER).value
        this.consume(TokenType.COLON)
        const dataType = this.parseType()
        const optional = dataType.endsWith("?")

        properties.push({
          type: "PropsProperty",
          name,
          dataType: optional ? dataType.slice(0, -1) : dataType,
          optional,
        })
      } while (this.match(TokenType.COMMA))
    }

    this.consume(TokenType.RPAREN)

    return {
      type: "Props",
      properties,
    }
  }

  private parseState(): StateNode {
    this.consume(TokenType.STATE)
    this.consume(TokenType.LBRACE)

    const properties: StateProperty[] = []

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const name = this.consume(TokenType.IDENTIFIER).value
      this.consume(TokenType.COLON)
      const dataType = this.parseType()

      let defaultValue: any
      if (this.match(TokenType.ASSIGN)) {
        defaultValue = this.parseValue()
      }

      properties.push({
        type: "StateProperty",
        name,
        dataType,
        defaultValue,
      })

      this.match(TokenType.COMMA)
    }

    this.consume(TokenType.RBRACE)

    return {
      type: "State",
      properties,
    }
  }

  private parseEvent(): EventNode {
    this.consume(TokenType.EVENT)
    const name = this.consume(TokenType.IDENTIFIER).value

    this.consume(TokenType.LPAREN)
    // Parse parameters (simplified)
    this.consume(TokenType.RPAREN)

    this.consume(TokenType.LBRACE)

    // Parse event body (simplified - just collect everything until closing brace)
    let body = ""
    let braceCount = 1

    while (braceCount > 0 && !this.isAtEnd()) {
      const token = this.advance()
      if (token.type === TokenType.LBRACE) {
        braceCount++
      } else if (token.type === TokenType.RBRACE) {
        braceCount--
      }

      if (braceCount > 0) {
        body += token.value + " "
      }
    }

    return {
      type: "Event",
      name,
      parameters: [],
      body: body.trim(),
    }
  }

  private parseJSXElement(): JSXElement {
    this.consume(TokenType.JSX_OPEN)
    const tagName = this.consume(TokenType.IDENTIFIER).value

    const attributes: JSXAttribute[] = []

    // Parse attributes
    while (!this.check(TokenType.JSX_CLOSE) && !this.check(TokenType.JSX_SELF_CLOSE) && !this.isAtEnd()) {
      const attrName = this.consume(TokenType.IDENTIFIER).value

      if (this.match(TokenType.ASSIGN)) {
        let value: string | JSXExpression

        if (this.check(TokenType.STRING)) {
          value = this.advance().value
        } else if (this.check(TokenType.LBRACE)) {
          // JSX expression
          this.consume(TokenType.LBRACE)
          let expr = ""
          let braceCount = 1

          while (braceCount > 0 && !this.isAtEnd()) {
            const token = this.advance()
            if (token.type === TokenType.LBRACE) {
              braceCount++
            } else if (token.type === TokenType.RBRACE) {
              braceCount--
            }

            if (braceCount > 0) {
              expr += token.value
            }
          }

          value = {
            type: "JSXExpression",
            expression: expr.trim(),
          }
        } else {
          value = this.advance().value
        }

        attributes.push({
          type: "JSXAttribute",
          name: attrName,
          value,
        })
      } else {
        attributes.push({
          type: "JSXAttribute",
          name: attrName,
          value: "true",
        })
      }
    }

    const selfClosing = this.check(TokenType.JSX_SELF_CLOSE)

    if (selfClosing) {
      this.consume(TokenType.JSX_SELF_CLOSE)
      return {
        type: "JSXElement",
        tagName,
        attributes,
        children: [],
        selfClosing: true,
      }
    }

    this.consume(TokenType.JSX_CLOSE)

    const children: (JSXElement | JSXText | JSXExpression)[] = []

    // Parse children
    while (!this.check(TokenType.JSX_END_OPEN) && !this.isAtEnd()) {
      if (this.check(TokenType.JSX_OPEN)) {
        children.push(this.parseJSXElement())
      } else if (this.check(TokenType.LBRACE)) {
        // JSX expression
        this.consume(TokenType.LBRACE)
        let expr = ""
        let braceCount = 1

        while (braceCount > 0 && !this.isAtEnd()) {
          const token = this.advance()
          if (token.type === TokenType.LBRACE) {
            braceCount++
          } else if (token.type === TokenType.RBRACE) {
            braceCount--
          }

          if (braceCount > 0) {
            expr += token.value
          }
        }

        children.push({
          type: "JSXExpression",
          expression: expr.trim(),
        })
      } else {
        // Text content
        let text = ""
        while (
          !this.check(TokenType.JSX_OPEN) &&
          !this.check(TokenType.JSX_END_OPEN) &&
          !this.check(TokenType.LBRACE) &&
          !this.isAtEnd()
        ) {
          text += this.advance().value + " "
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
    this.consume(TokenType.IDENTIFIER) // closing tag name
    this.consume(TokenType.JSX_CLOSE)

    return {
      type: "JSXElement",
      tagName,
      attributes,
      children,
      selfClosing: false,
    }
  }

  private parseType(): string {
    let type = this.consume(TokenType.IDENTIFIER).value

    // Handle array types
    if (this.check(TokenType.LBRACKET)) {
      this.consume(TokenType.LBRACKET)
      this.consume(TokenType.RBRACKET)
      type += "[]"
    }

    return type
  }

  private parseValue(): any {
    const token = this.peek()

    switch (token.type) {
      case TokenType.STRING:
        return this.advance().value
      case TokenType.NUMBER:
        const numValue = this.advance().value
        return numValue.includes(".") ? Number.parseFloat(numValue) : Number.parseInt(numValue)
      case TokenType.BOOLEAN:
        return this.advance().value === "true"
      case TokenType.LBRACKET:
        return this.parseArray()
      case TokenType.LBRACE:
        return this.parseObject()
      default:
        return this.advance().value
    }
  }

  private parseArray(): any[] {
    this.consume(TokenType.LBRACKET)
    const items: any[] = []

    while (!this.check(TokenType.RBRACKET) && !this.isAtEnd()) {
      items.push(this.parseValue())
      this.match(TokenType.COMMA)
    }

    this.consume(TokenType.RBRACKET)
    return items
  }

  private parseObject(): Record<string, any> {
    this.consume(TokenType.LBRACE)
    const obj: Record<string, any> = {}

    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const key = this.consume(TokenType.IDENTIFIER).value
      this.consume(TokenType.COLON)
      const value = this.parseValue()
      obj[key] = value
      this.match(TokenType.COMMA)
    }

    this.consume(TokenType.RBRACE)
    return obj
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance()
        return true
      }
    }
    return false
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false
    return this.peek().type === type
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++
    return this.previous()
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF
  }

  private peek(): Token {
    return this.tokens[this.current]
  }

  private previous(): Token {
    return this.tokens[this.current - 1]
  }

  private consume(type: TokenType): Token {
    if (this.check(type)) return this.advance()

    const current = this.peek()
    throw new Error(`Expected ${type} but got ${current.type} at line ${current.line}`)
  }
}

export function parseS4FT(input: string): S4FTNode {
  const lexer = new Lexer(input)
  const tokens = lexer.tokenize()
  const parser = new Parser(tokens)
  return parser.parse()
}
