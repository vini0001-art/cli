import type { Lexer } from "../lexer/lexer"
import type { Token } from "../token/token"

export class Parser {
  private lexer: Lexer
  private currentToken: Token | null = null
  private peekToken: Token | null = null

  constructor(lexer: Lexer) {
    this.lexer = lexer
    this.nextToken()
    this.nextToken()
  }

  nextToken(): void {
    this.currentToken = this.peekToken
    this.peekToken = this.lexer.nextToken()
  }
}
