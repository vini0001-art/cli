export enum TokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",

  // Identifiers + literals
  IDENT = "IDENT",
  INT = "INT",
  STRING = "STRING",

  // Operators
  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",

  LT = "<",
  GT = ">",

  // Delimiters
  COMMA = ",",
  SEMICOLON = ";",
  COLON = ":",

  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  LBRACKET = "[",
  RBRACKET = "]",

  // Keywords
  COMPONENT = "COMPONENT",
  PAGE = "PAGE",
  LAYOUT = "LAYOUT",
  PROPS = "PROPS",
  STATE = "STATE",
  EVENT = "EVENT",
  EXPORT = "EXPORT",
  IMPORT = "IMPORT",
  FROM = "FROM",

  // Types
  STRING_TYPE = "string",
  NUMBER_TYPE = "number",
  BOOLEAN_TYPE = "boolean",
  ARRAY_TYPE = "array",
  OBJECT_TYPE = "object",
}

export interface Token {
  type: TokenType
  literal: string
}

const keywords: Record<string, TokenType> = {
  component: TokenType.COMPONENT,
  page: TokenType.PAGE,
  layout: TokenType.LAYOUT,
  props: TokenType.PROPS,
  state: TokenType.STATE,
  event: TokenType.EVENT,
  export: TokenType.EXPORT,
  import: TokenType.IMPORT,
  from: TokenType.FROM,
  string: TokenType.STRING_TYPE,
  number: TokenType.NUMBER_TYPE,
  boolean: TokenType.BOOLEAN_TYPE,
  array: TokenType.ARRAY_TYPE,
  object: TokenType.OBJECT_TYPE,
}

export class Lexer {
  private input: string
  private position = 0
  private readPosition = 0
  private ch = ""

  constructor(input: string) {
    this.input = input
    this.readChar()
  }

  private readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = "\0"
    } else {
      this.ch = this.input[this.readPosition]
    }
    this.position = this.readPosition
    this.readPosition++
  }

  private peekChar(): string {
    if (this.readPosition >= this.input.length) {
      return "\0"
    }
    return this.input[this.readPosition]
  }

  private skipWhitespace(): void {
    while (this.ch === " " || this.ch === "\t" || this.ch === "\n" || this.ch === "\r") {
      this.readChar()
    }
  }

  private readIdentifier(): string {
    const position = this.position
    while (this.isLetter(this.ch) || this.isDigit(this.ch)) {
      this.readChar()
    }
    return this.input.slice(position, this.position)
  }

  private readNumber(): string {
    const position = this.position
    while (this.isDigit(this.ch)) {
      this.readChar()
    }
    return this.input.slice(position, this.position)
  }

  private readString(): string {
    const position = this.position + 1
    do {
      this.readChar()
    } while (this.ch !== '"' && this.ch !== "\0")
    return this.input.slice(position, this.position)
  }

  private isLetter(ch: string): boolean {
    return /[a-zA-Z_]/.test(ch)
  }

  private isDigit(ch: string): boolean {
    return /[0-9]/.test(ch)
  }

  private lookupIdent(ident: string): TokenType {
    return keywords[ident] || TokenType.IDENT
  }

  public nextToken(): Token {
    let tok: Token

    this.skipWhitespace()

    switch (this.ch) {
      case "=":
        tok = { type: TokenType.ASSIGN, literal: this.ch }
        break
      case "+":
        tok = { type: TokenType.PLUS, literal: this.ch }
        break
      case "-":
        tok = { type: TokenType.MINUS, literal: this.ch }
        break
      case "!":
        tok = { type: TokenType.BANG, literal: this.ch }
        break
      case "*":
        tok = { type: TokenType.ASTERISK, literal: this.ch }
        break
      case "/":
        tok = { type: TokenType.SLASH, literal: this.ch }
        break
      case "<":
        tok = { type: TokenType.LT, literal: this.ch }
        break
      case ">":
        tok = { type: TokenType.GT, literal: this.ch }
        break
      case ",":
        tok = { type: TokenType.COMMA, literal: this.ch }
        break
      case ";":
        tok = { type: TokenType.SEMICOLON, literal: this.ch }
        break
      case ":":
        tok = { type: TokenType.COLON, literal: this.ch }
        break
      case "(":
        tok = { type: TokenType.LPAREN, literal: this.ch }
        break
      case ")":
        tok = { type: TokenType.RPAREN, literal: this.ch }
        break
      case "{":
        tok = { type: TokenType.LBRACE, literal: this.ch }
        break
      case "}":
        tok = { type: TokenType.RBRACE, literal: this.ch }
        break
      case "[":
        tok = { type: TokenType.LBRACKET, literal: this.ch }
        break
      case "]":
        tok = { type: TokenType.RBRACKET, literal: this.ch }
        break
      case '"':
        tok = { type: TokenType.STRING, literal: this.readString() }
        break
      case "\0":
        tok = { type: TokenType.EOF, literal: "" }
        break
      default:
        if (this.isLetter(this.ch)) {
          const literal = this.readIdentifier()
          const type = this.lookupIdent(literal)
          return { type, literal }
        } else if (this.isDigit(this.ch)) {
          return { type: TokenType.INT, literal: this.readNumber() }
        } else {
          tok = { type: TokenType.ILLEGAL, literal: this.ch }
        }
    }

    this.readChar()
    return tok
  }
}
