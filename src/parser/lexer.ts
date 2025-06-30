export enum TokenType {
  // Literals
  IDENTIFIER = "IDENTIFIER",
  STRING = "STRING",
  NUMBER = "NUMBER",

  // Keywords
  PAGE = "PAGE",
  COMPONENT = "COMPONENT",
  STATE = "STATE",
  EVENT = "EVENT",

  // Symbols
  LBRACE = "{",
  RBRACE = "}",
  LPAREN = "(",
  RPAREN = ")",
  COLON = ":",
  SEMICOLON = ";",
  COMMA = ",",
  ASSIGN = "=",

  // Special
  EOF = "EOF",
  ILLEGAL = "ILLEGAL",
}

export interface Token {
  type: TokenType
  value: string
  line: number
  column: number
}

export class Lexer {
  private input: string
  private position = 0
  private readPosition = 0
  private ch = ""
  private line = 1
  private column = 0

  constructor(input: string) {
    this.input = input
    this.readChar()
  }

  private readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = ""
    } else {
      this.ch = this.input[this.readPosition]
    }
    this.position = this.readPosition
    this.readPosition++

    if (this.ch === "\n") {
      this.line++
      this.column = 0
    } else {
      this.column++
    }
  }

  private peekChar(): string {
    if (this.readPosition >= this.input.length) {
      return ""
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

  private readString(): string {
    const position = this.position + 1
    do {
      this.readChar()
    } while (this.ch !== '"' && this.ch !== "")
    return this.input.slice(position, this.position)
  }

  private readNumber(): string {
    const position = this.position
    while (this.isDigit(this.ch) || this.ch === ".") {
      this.readChar()
    }
    return this.input.slice(position, this.position)
  }

  private isLetter(ch: string): boolean {
    return /[a-zA-Z_]/.test(ch)
  }

  private isDigit(ch: string): boolean {
    return /[0-9]/.test(ch)
  }

  private lookupIdent(ident: string): TokenType {
    const keywords: { [key: string]: TokenType } = {
      page: TokenType.PAGE,
      component: TokenType.COMPONENT,
      state: TokenType.STATE,
      event: TokenType.EVENT,
    }
    return keywords[ident] || TokenType.IDENTIFIER
  }

  public nextToken(): Token {
    let token: Token

    this.skipWhitespace()

    switch (this.ch) {
      case "=":
        token = { type: TokenType.ASSIGN, value: this.ch, line: this.line, column: this.column }
        break
      case ":":
        token = { type: TokenType.COLON, value: this.ch, line: this.line, column: this.column }
        break
      case ";":
        token = { type: TokenType.SEMICOLON, value: this.ch, line: this.line, column: this.column }
        break
      case ",":
        token = { type: TokenType.COMMA, value: this.ch, line: this.line, column: this.column }
        break
      case "(":
        token = { type: TokenType.LPAREN, value: this.ch, line: this.line, column: this.column }
        break
      case ")":
        token = { type: TokenType.RPAREN, value: this.ch, line: this.line, column: this.column }
        break
      case "{":
        token = { type: TokenType.LBRACE, value: this.ch, line: this.line, column: this.column }
        break
      case "}":
        token = { type: TokenType.RBRACE, value: this.ch, line: this.line, column: this.column }
        break
      case '"':
        token = { type: TokenType.STRING, value: this.readString(), line: this.line, column: this.column }
        break
      case "":
        token = { type: TokenType.EOF, value: "", line: this.line, column: this.column }
        break
      default:
        if (this.isLetter(this.ch)) {
          const value = this.readIdentifier()
          const type = this.lookupIdent(value)
          return { type, value, line: this.line, column: this.column }
        } else if (this.isDigit(this.ch)) {
          const value = this.readNumber()
          return { type: TokenType.NUMBER, value, line: this.line, column: this.column }
        } else {
          token = { type: TokenType.ILLEGAL, value: this.ch, line: this.line, column: this.column }
        }
    }

    this.readChar()
    return token
  }
}
