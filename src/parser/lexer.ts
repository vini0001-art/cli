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
  IMPORT = "IMPORT",
  EXPORT = "EXPORT",
  FROM = "FROM",
  DEFAULT = "DEFAULT",
  FUNCTION = "FUNCTION",
  CONST = "CONST",
  LET = "LET",
  VAR = "VAR",
  IF = "IF",
  ELSE = "ELSE",
  FOR = "FOR",
  WHILE = "WHILE",
  RETURN = "RETURN",
  TRUE = "TRUE",
  FALSE = "FALSE",
  NULL = "NULL",
  UNDEFINED = "UNDEFINED",

  // Operators
  ASSIGN = "ASSIGN",
  PLUS = "PLUS",
  MINUS = "MINUS",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
  MODULO = "MODULO",
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN = "GREATER_THAN",
  LESS_EQUAL = "LESS_EQUAL",
  GREATER_EQUAL = "GREATER_EQUAL",
  LOGICAL_AND = "LOGICAL_AND",
  LOGICAL_OR = "LOGICAL_OR",
  LOGICAL_NOT = "LOGICAL_NOT",

  // Punctuation
  SEMICOLON = "SEMICOLON",
  COMMA = "COMMA",
  DOT = "DOT",
  COLON = "COLON",
  QUESTION = "QUESTION",
  ARROW = "ARROW",

  // Brackets
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  LBRACE = "LBRACE",
  RBRACE = "RBRACE",
  LBRACKET = "LBRACKET",
  RBRACKET = "RBRACKET",

  // JSX
  JSX_OPEN = "JSX_OPEN",
  JSX_CLOSE = "JSX_CLOSE",
  JSX_SELF_CLOSE = "JSX_SELF_CLOSE",
  JSX_END_OPEN = "JSX_END_OPEN",
  JSX_TEXT = "JSX_TEXT",

  // Special
  NEWLINE = "NEWLINE",
  WHITESPACE = "WHITESPACE",
  COMMENT = "COMMENT",
  EOF = "EOF",
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
  private tokens: Token[] = []

  constructor(input: string) {
    this.input = input
  }

  tokenize(): Token[] {
    while (this.position < this.input.length) {
      this.scanToken()
    }

    this.addToken(TokenType.EOF, "")
    return this.tokens
  }

  private scanToken(): void {
    const char = this.advance()

    switch (char) {
      case " ":
      case "\r":
      case "\t":
        // Ignore whitespace
        break
      case "\n":
        this.addToken(TokenType.NEWLINE, char)
        this.line++
        this.column = 1
        break
      case "(":
        this.addToken(TokenType.LPAREN, char)
        break
      case ")":
        this.addToken(TokenType.RPAREN, char)
        break
      case "{":
        this.addToken(TokenType.LBRACE, char)
        break
      case "}":
        this.addToken(TokenType.RBRACE, char)
        break
      case "[":
        this.addToken(TokenType.LBRACKET, char)
        break
      case "]":
        this.addToken(TokenType.RBRACKET, char)
        break
      case ",":
        this.addToken(TokenType.COMMA, char)
        break
      case ".":
        this.addToken(TokenType.DOT, char)
        break
      case ";":
        this.addToken(TokenType.SEMICOLON, char)
        break
      case ":":
        this.addToken(TokenType.COLON, char)
        break
      case "?":
        this.addToken(TokenType.QUESTION, char)
        break
      case "+":
        this.addToken(TokenType.PLUS, char)
        break
      case "-":
        this.addToken(TokenType.MINUS, char)
        break
      case "*":
        this.addToken(TokenType.MULTIPLY, char)
        break
      case "/":
        if (this.match("/")) {
          // Line comment
          this.lineComment()
        } else if (this.match("*")) {
          // Block comment
          this.blockComment()
        } else {
          this.addToken(TokenType.DIVIDE, char)
        }
        break
      case "%":
        this.addToken(TokenType.MODULO, char)
        break
      case "=":
        if (this.match("=")) {
          this.addToken(TokenType.EQUAL, "==")
        } else if (this.match(">")) {
          this.addToken(TokenType.ARROW, "=>")
        } else {
          this.addToken(TokenType.ASSIGN, char)
        }
        break
      case "!":
        if (this.match("=")) {
          this.addToken(TokenType.NOT_EQUAL, "!=")
        } else {
          this.addToken(TokenType.LOGICAL_NOT, char)
        }
        break
      case "<":
        if (this.match("=")) {
          this.addToken(TokenType.LESS_EQUAL, "<=")
        } else if (this.match("/")) {
          this.addToken(TokenType.JSX_END_OPEN, "</")
        } else {
          // Check if it's JSX or less than
          if (this.isJSXContext()) {
            this.addToken(TokenType.JSX_OPEN, char)
          } else {
            this.addToken(TokenType.LESS_THAN, char)
          }
        }
        break
      case ">":
        if (this.match("=")) {
          this.addToken(TokenType.GREATER_EQUAL, ">=")
        } else {
          this.addToken(TokenType.JSX_CLOSE, char)
        }
        break
      case "&":
        if (this.match("&")) {
          this.addToken(TokenType.LOGICAL_AND, "&&")
        }
        break
      case "|":
        if (this.match("|")) {
          this.addToken(TokenType.LOGICAL_OR, "||")
        }
        break
      case '"':
        this.string('"')
        break
      case "'":
        this.string("'")
        break
      case "`":
        this.templateString()
        break
      default:
        if (this.isDigit(char)) {
          this.number()
        } else if (this.isAlpha(char)) {
          this.identifier()
        } else {
          throw new Error(`Unexpected character: ${char} at line ${this.line}`)
        }
        break
    }
  }

  private advance(): string {
    const char = this.input[this.position]
    this.position++
    this.column++
    return char
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false
    if (this.input[this.position] !== expected) return false

    this.position++
    this.column++
    return true
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0"
    return this.input[this.position]
  }

  private peekNext(): string {
    if (this.position + 1 >= this.input.length) return "\0"
    return this.input[this.position + 1]
  }

  private isAtEnd(): boolean {
    return this.position >= this.input.length
  }

  private isDigit(char: string): boolean {
    return char >= "0" && char <= "9"
  }

  private isAlpha(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === "_"
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char)
  }

  private isJSXContext(): boolean {
    // Simple heuristic to detect JSX context
    // Look for JSX patterns in recent tokens
    const recentTokens = this.tokens.slice(-5)
    return recentTokens.some(
      (token) =>
        token.type === TokenType.RETURN ||
        token.type === TokenType.LPAREN ||
        token.type === TokenType.JSX_CLOSE ||
        token.type === TokenType.LBRACE,
    )
  }

  private string(quote: string): void {
    const start = this.position - 1
    let value = ""

    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        this.line++
        this.column = 1
      }
      if (this.peek() === "\\") {
        this.advance() // consume backslash
        const escaped = this.advance()
        switch (escaped) {
          case "n":
            value += "\n"
            break
          case "t":
            value += "\t"
            break
          case "r":
            value += "\r"
            break
          case "\\":
            value += "\\"
            break
          case quote:
            value += quote
            break
          default:
            value += escaped
        }
      } else {
        value += this.advance()
      }
    }

    if (this.isAtEnd()) {
      throw new Error(`Unterminated string at line ${this.line}`)
    }

    // Consume closing quote
    this.advance()

    this.addToken(TokenType.STRING, value)
  }

  private templateString(): void {
    let value = ""

    while (this.peek() !== "`" && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        this.line++
        this.column = 1
      }
      value += this.advance()
    }

    if (this.isAtEnd()) {
      throw new Error(`Unterminated template string at line ${this.line}`)
    }

    // Consume closing backtick
    this.advance()

    this.addToken(TokenType.STRING, value)
  }

  private number(): void {
    const start = this.position - 1
    let value = this.input[start]

    while (this.isDigit(this.peek())) {
      value += this.advance()
    }

    // Look for decimal part
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      value += this.advance() // consume '.'

      while (this.isDigit(this.peek())) {
        value += this.advance()
      }
    }

    this.addToken(TokenType.NUMBER, value)
  }

  private identifier(): void {
    const start = this.position - 1
    let value = this.input[start]

    while (this.isAlphaNumeric(this.peek())) {
      value += this.advance()
    }

    // Check if it's a keyword
    const type = this.getKeywordType(value) || TokenType.IDENTIFIER
    this.addToken(type, value)
  }

  private getKeywordType(text: string): TokenType | null {
    const keywords: Record<string, TokenType> = {
      page: TokenType.PAGE,
      component: TokenType.COMPONENT,
      state: TokenType.STATE,
      event: TokenType.EVENT,
      props: TokenType.PROPS,
      import: TokenType.IMPORT,
      export: TokenType.EXPORT,
      from: TokenType.FROM,
      default: TokenType.DEFAULT,
      function: TokenType.FUNCTION,
      const: TokenType.CONST,
      let: TokenType.LET,
      var: TokenType.VAR,
      if: TokenType.IF,
      else: TokenType.ELSE,
      for: TokenType.FOR,
      while: TokenType.WHILE,
      return: TokenType.RETURN,
      true: TokenType.TRUE,
      false: TokenType.FALSE,
      null: TokenType.NULL,
      undefined: TokenType.UNDEFINED,
    }

    return keywords[text.toLowerCase()] || null
  }

  private lineComment(): void {
    let comment = "//"
    while (this.peek() !== "\n" && !this.isAtEnd()) {
      comment += this.advance()
    }
    this.addToken(TokenType.COMMENT, comment)
  }

  private blockComment(): void {
    let comment = "/*"
    let depth = 1

    while (depth > 0 && !this.isAtEnd()) {
      if (this.peek() === "/" && this.peekNext() === "*") {
        comment += this.advance()
        comment += this.advance()
        depth++
      } else if (this.peek() === "*" && this.peekNext() === "/") {
        comment += this.advance()
        comment += this.advance()
        depth--
      } else {
        if (this.peek() === "\n") {
          this.line++
          this.column = 1
        }
        comment += this.advance()
      }
    }

    if (depth > 0) {
      throw new Error(`Unterminated block comment at line ${this.line}`)
    }

    this.addToken(TokenType.COMMENT, comment)
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: this.column - value.length,
    })
  }
}
