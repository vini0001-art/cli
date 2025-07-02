export declare enum TokenType {
    IDENTIFIER = "IDENTIFIER",
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    PAGE = "PAGE",
    COMPONENT = "COMPONENT",
    STATE = "STATE",
    EVENT = "EVENT",
    PROPS = "PROPS",
    ASSIGN = "=",
    PLUS = "+",
    MINUS = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
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
    JSX_OPEN = "<",
    JSX_CLOSE = ">",
    JSX_SELF_CLOSE = "/>",
    JSX_END_OPEN = "</",
    EOF = "EOF",
    NEWLINE = "NEWLINE",
    WHITESPACE = "WHITESPACE"
}
export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}
export declare class Lexer {
    private input;
    private position;
    private line;
    private column;
    constructor(input: string);
    tokenize(): Token[];
    s4ftToken(): Token;
    private readNumber;
    private readString;
    private readIdentifier;
    private getKeywordType;
    private getSingleCharToken;
    private skipWhitespace;
    private advance;
    private peek;
    private createToken;
    private isDigit;
    private isLetter;
    private isAlphaNumeric;
    private isWhitespace;
}
