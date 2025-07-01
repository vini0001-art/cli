export enum TokenType {
  // Literals
  IDENTIFIER = "IDENTIFIER",
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",

  // Keywords
  PAGE = "PAGE",
  COMPONENT = "COMPONENT",
  STATE = "STATE",
  EVENT = "EVENT",
  PROPS = "PROPS",

  // Operators
  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  MULTIPLY = "*",
  DIVIDE = "/",

  // Delimiters
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  LBRACKET = "[",
  RBRACKET = "]",
  SEMICOLON = ";",
  COMMA = ",",
  COLON = ":",
  DOT = ".",

  // JSX
  JSX_OPEN = "<",
  JSX_CLOSE = ">",
  JSX_SELF_CLOSE = "/>",
  JSX_END_OPEN = "</",

  // Special
  EOF = "EOF",
  NEWLINE = "NEWLINE",
  WHITESPACE = "WHITESPACE",
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
  private line = 1
  private column = 1

  constructor(input: string) {
    this.input = input
  }

  tokenize(): Token[] {
    const tokens: Token[] = []

    while (this.position < this.input.length) {
      const token = this.nextToken()
      if (token.type !== TokenType.WHITESPACE) {
        tokens.push(token)
      }
    }

    tokens.push({
      type: TokenType.EOF,
      value: "",
      line: this.line,
      column: this.column,
    })

    return tokens
  }

  private nextToken(): Token {
    this.skipWhitespace()

    if (this.position >= this.input.length) {
      return this.createToken(TokenType.EOF, "")
    }

    const char = this.input[this.position]

    // Numbers
    if (this.isDigit(char)) {
      return this.readNumber()
    }

    // Strings
    if (char === '"' || char === "'") {
      return this.readString()
    }

    // Identifiers and keywords
    if (this.isLetter(char) || char === "_") {
      return this.readIdentifier()
    }

    // JSX tags
    if (char === "<") {
      if (this.peek() === "/") {
        this.advance()
        this.advance()
        return this.createToken(TokenType.JSX_END_OPEN, "</")
      }
      this.advance()
      return this.createToken(TokenType.JSX_OPEN, "<")
    }

    if (char === ">" || (char === "/" && this.peek() === ">")) {
      if (char === "/" && this.peek() === ">") {
        this.advance()
        this.advance()
        return this.createToken(TokenType.JSX_SELF_CLOSE, "/>")
      }
      this.advance()
      return this.createToken(TokenType.JSX_CLOSE, ">")
    }

    // Single character tokens
    const singleChar = this.getSingleCharToken(char)
    if (singleChar) {
      this.advance()
      return this.createToken(singleChar, char)
    }

    // Unknown character
    this.advance()
    return this.createToken(TokenType.IDENTIFIER, char)
  }

  private readNumber(): Token {
    const start = this.position

    while (this.isDigit(this.input[this.position]) || this.input[this.position] === ".") {
      this.advance()
    }

    const value = this.input.slice(start, this.position)
    return this.createToken(TokenType.NUMBER, value)
  }

  private readString(): Token {
    const quote = this.input[this.position]
    this.advance() // Skip opening quote

    const start = this.position

    while (this.position < this.input.length && this.input[this.position] !== quote) {
      if (this.input[this.position] === "\\") {
        this.advance() // Skip escape character
      }
      this.advance()
    }

    const value = this.input.slice(start, this.position)
    this.advance() // Skip closing quote

    return this.createToken(TokenType.STRING, value)
  }

  private readIdentifier(): Token {
    const start = this.position

    while (this.isAlphaNumeric(this.input[this.position])) {
      this.advance()
    }

    const value = this.input.slice(start, this.position)
    const type = this.getKeywordType(value) || TokenType.IDENTIFIER

    return this.createToken(type, value)
  }

  private getKeywordType(value: string): TokenType | null {
    const keywords: Record<string, TokenType> = {
      page: TokenType.PAGE,
      component: TokenType.COMPONENT,
      state: TokenType.STATE,
      event: TokenType.EVENT,
      props: TokenType.PROPS,
      true: TokenType.BOOLEAN,
      false: TokenType.BOOLEAN,
    }

    return keywords[value] || null
  }

  private getSingleCharToken(char: string): TokenType | null {
    const tokens: Record<string, TokenType> = {
      "(": TokenType.LPAREN,
      ")": TokenType.RPAREN,
      "{": TokenType.LBRACE,
      "}": TokenType.RBRACE,
      "[": TokenType.LBRACKET,
      "]": TokenType.RBRACKET,
      ";": TokenType.SEMICOLON,
      ",": TokenType.COMMA,
      ":": TokenType.COLON,
      ".": TokenType.DOT,
      "=": TokenType.ASSIGN,
      "+": TokenType.PLUS,
      "-": TokenType.MINUS,
      "*": TokenType.MULTIPLY,
      "/": TokenType.DIVIDE,
    }

    return tokens[char] || null
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && this.isWhitespace(this.input[this.position])) {
      if (this.input[this.position] === "\n") {
        this.line++
        this.column = 1
      } else {
        this.column++
      }
      this.position++
    }
  }

  private advance(): void {
    if (this.position < this.input.length) {
      if (this.input[this.position] === "\n") {
        this.line++
        this.column = 1
      } else {
        this.column++
      }
      this.position++
    }
  }

  private peek(): string {
    return this.input[this.position + 1] || ""
  }

  private createToken(type: TokenType, value: string): Token {
    return {
      type,
      value,
      line: this.line,
      column: this.column,
    }
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char)
  }

  private isLetter(char: string): boolean {
    return /[a-zA-Z]/.test(char)
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isLetter(char) || this.isDigit(char) || char === "_"
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char)
  }
}
