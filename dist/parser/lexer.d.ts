export declare enum TokenType {
    IDENTIFIER = "IDENTIFIER",
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    COMPONENT = "component",
    PAGE = "page",
    LAYOUT = "layout",
    IMPORT = "import",
    EXPORT = "export",
    FROM = "from",
    IF = "if",
    ELSE = "else",
    FOR = "for",
    IN = "in",
    STATE = "state",
    PROPS = "props",
    EVENT = "event",
    ASSIGN = "=",
    PLUS = "+",
    MINUS = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
    EQUALS = "==",
    NOT_EQUALS = "!=",
    LESS_THAN = "<",
    GREATER_THAN = ">",
    SEMICOLON = ";",
    COMMA = ",",
    DOT = ".",
    COLON = ":",
    LEFT_PAREN = "(",
    RIGHT_PAREN = ")",
    LEFT_BRACE = "{",
    RIGHT_BRACE = "}",
    LEFT_BRACKET = "[",
    RIGHT_BRACKET = "]",
    ARROW = "=>",
    TEMPLATE_START = "${",
    NEWLINE = "NEWLINE",
    EOF = "EOF",
    JSX_OPEN = "<",
    JSX_CLOSE = ">",
    JSX_SELF_CLOSE = "/>",
    JSX_END_OPEN = "</"
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
    private peek;
    private advance;
    private skipWhitespace;
    private readString;
    private readNumber;
    private readIdentifier;
    private getKeywordType;
    tokenize(): Token[];
}
//# sourceMappingURL=lexer.d.ts.map