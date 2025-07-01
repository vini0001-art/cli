"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    // Literals
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["STRING"] = "STRING";
    TokenType["NUMBER"] = "NUMBER";
    TokenType["BOOLEAN"] = "BOOLEAN";
    // Keywords
    TokenType["COMPONENT"] = "component";
    TokenType["PAGE"] = "page";
    TokenType["LAYOUT"] = "layout";
    TokenType["IMPORT"] = "import";
    TokenType["EXPORT"] = "export";
    TokenType["FROM"] = "from";
    TokenType["IF"] = "if";
    TokenType["ELSE"] = "else";
    TokenType["FOR"] = "for";
    TokenType["IN"] = "in";
    TokenType["STATE"] = "state";
    TokenType["PROPS"] = "props";
    TokenType["EVENT"] = "event";
    // Operators
    TokenType["ASSIGN"] = "=";
    TokenType["PLUS"] = "+";
    TokenType["MINUS"] = "-";
    TokenType["MULTIPLY"] = "*";
    TokenType["DIVIDE"] = "/";
    TokenType["EQUALS"] = "==";
    TokenType["NOT_EQUALS"] = "!=";
    TokenType["LESS_THAN"] = "<";
    TokenType["GREATER_THAN"] = ">";
    // Delimiters
    TokenType["SEMICOLON"] = ";";
    TokenType["COMMA"] = ",";
    TokenType["DOT"] = ".";
    TokenType["COLON"] = ":";
    // Brackets
    TokenType["LEFT_PAREN"] = "(";
    TokenType["RIGHT_PAREN"] = ")";
    TokenType["LEFT_BRACE"] = "{";
    TokenType["RIGHT_BRACE"] = "}";
    TokenType["LEFT_BRACKET"] = "[";
    TokenType["RIGHT_BRACKET"] = "]";
    // Special
    TokenType["ARROW"] = "=>";
    TokenType["TEMPLATE_START"] = "${";
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["EOF"] = "EOF";
    // JSX-like
    TokenType["JSX_OPEN"] = "<";
    TokenType["JSX_CLOSE"] = ">";
    TokenType["JSX_SELF_CLOSE"] = "/>";
    TokenType["JSX_END_OPEN"] = "</";
})(TokenType || (exports.TokenType = TokenType = {}));
class Lexer {
    constructor(input) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.input = input;
    }
    peek(offset = 0) {
        const pos = this.position + offset;
        return pos >= this.input.length ? "\0" : this.input[pos];
    }
    advance() {
        if (this.position >= this.input.length)
            return "\0";
        const char = this.input[this.position];
        this.position++;
        if (char === "\n") {
            this.line++;
            this.column = 1;
        }
        else {
            this.column++;
        }
        return char;
    }
    skipWhitespace() {
        while (this.peek() && /\s/.test(this.peek()) && this.peek() !== "\n") {
            this.advance();
        }
    }
    readString(quote) {
        let value = "";
        this.advance(); // Skip opening quote
        while (this.peek() && this.peek() !== quote) {
            if (this.peek() === "\\") {
                this.advance();
                const escaped = this.advance();
                switch (escaped) {
                    case "n":
                        value += "\n";
                        break;
                    case "t":
                        value += "\t";
                        break;
                    case "r":
                        value += "\r";
                        break;
                    case "\\":
                        value += "\\";
                        break;
                    case quote:
                        value += quote;
                        break;
                    default:
                        value += escaped;
                        break;
                }
            }
            else {
                value += this.advance();
            }
        }
        if (this.peek() === quote) {
            this.advance(); // Skip closing quote
        }
        return value;
    }
    readNumber() {
        let value = "";
        while (this.peek() && /[\d.]/.test(this.peek())) {
            value += this.advance();
        }
        return value;
    }
    readIdentifier() {
        let value = "";
        while (this.peek() && /[a-zA-Z0-9_$]/.test(this.peek())) {
            value += this.advance();
        }
        return value;
    }
    getKeywordType(identifier) {
        const keywords = {
            component: TokenType.COMPONENT,
            page: TokenType.PAGE,
            layout: TokenType.LAYOUT,
            import: TokenType.IMPORT,
            export: TokenType.EXPORT,
            from: TokenType.FROM,
            if: TokenType.IF,
            else: TokenType.ELSE,
            for: TokenType.FOR,
            in: TokenType.IN,
            state: TokenType.STATE,
            props: TokenType.PROPS,
            event: TokenType.EVENT,
            true: TokenType.BOOLEAN,
            false: TokenType.BOOLEAN,
        };
        return keywords[identifier] || TokenType.IDENTIFIER;
    }
    tokenize() {
        const tokens = [];
        while (this.position < this.input.length) {
            this.skipWhitespace();
            if (this.position >= this.input.length)
                break;
            const char = this.peek();
            const line = this.line;
            const column = this.column;
            // Comments
            if (char === "/" && this.peek(1) === "/") {
                while (this.peek() && this.peek() !== "\n") {
                    this.advance();
                }
                continue;
            }
            // Multi-line comments
            if (char === "/" && this.peek(1) === "*") {
                this.advance(); // /
                this.advance(); // *
                while (this.peek() && !(this.peek() === "*" && this.peek(1) === "/")) {
                    this.advance();
                }
                if (this.peek() === "*") {
                    this.advance(); // *
                    this.advance(); // /
                }
                continue;
            }
            // Strings
            if (char === '"' || char === "'") {
                const value = this.readString(char);
                tokens.push({ type: TokenType.STRING, value, line, column });
                continue;
            }
            // Numbers
            if (/\d/.test(char)) {
                const value = this.readNumber();
                tokens.push({ type: TokenType.NUMBER, value, line, column });
                continue;
            }
            // Identifiers and keywords
            if (/[a-zA-Z_$]/.test(char)) {
                const value = this.readIdentifier();
                const type = this.getKeywordType(value);
                tokens.push({ type, value, line, column });
                continue;
            }
            // Two-character operators
            if (char === "=" && this.peek(1) === ">") {
                this.advance();
                this.advance();
                tokens.push({ type: TokenType.ARROW, value: "=>", line, column });
                continue;
            }
            if (char === "=" && this.peek(1) === "=") {
                this.advance();
                this.advance();
                tokens.push({ type: TokenType.EQUALS, value: "==", line, column });
                continue;
            }
            if (char === "!" && this.peek(1) === "=") {
                this.advance();
                this.advance();
                tokens.push({ type: TokenType.NOT_EQUALS, value: "!=", line, column });
                continue;
            }
            if (char === "/" && this.peek(1) === ">") {
                this.advance();
                this.advance();
                tokens.push({ type: TokenType.JSX_SELF_CLOSE, value: "/>", line, column });
                continue;
            }
            if (char === "<" && this.peek(1) === "/") {
                this.advance();
                this.advance();
                tokens.push({ type: TokenType.JSX_END_OPEN, value: "</", line, column });
                continue;
            }
            // Single-character tokens
            const singleChar = this.advance();
            switch (singleChar) {
                case "=":
                    tokens.push({ type: TokenType.ASSIGN, value: singleChar, line, column });
                    break;
                case "+":
                    tokens.push({ type: TokenType.PLUS, value: singleChar, line, column });
                    break;
                case "-":
                    tokens.push({ type: TokenType.MINUS, value: singleChar, line, column });
                    break;
                case "*":
                    tokens.push({ type: TokenType.MULTIPLY, value: singleChar, line, column });
                    break;
                case "/":
                    tokens.push({ type: TokenType.DIVIDE, value: singleChar, line, column });
                    break;
                case "<":
                    tokens.push({ type: TokenType.JSX_OPEN, value: singleChar, line, column });
                    break;
                case ">":
                    tokens.push({ type: TokenType.JSX_CLOSE, value: singleChar, line, column });
                    break;
                case "(":
                    tokens.push({ type: TokenType.LEFT_PAREN, value: singleChar, line, column });
                    break;
                case ")":
                    tokens.push({ type: TokenType.RIGHT_PAREN, value: singleChar, line, column });
                    break;
                case "{":
                    tokens.push({ type: TokenType.LEFT_BRACE, value: singleChar, line, column });
                    break;
                case "}":
                    tokens.push({ type: TokenType.RIGHT_BRACE, value: singleChar, line, column });
                    break;
                case "[":
                    tokens.push({ type: TokenType.LEFT_BRACKET, value: singleChar, line, column });
                    break;
                case "]":
                    tokens.push({ type: TokenType.RIGHT_BRACKET, value: singleChar, line, column });
                    break;
                case ";":
                    tokens.push({ type: TokenType.SEMICOLON, value: singleChar, line, column });
                    break;
                case ",":
                    tokens.push({ type: TokenType.COMMA, value: singleChar, line, column });
                    break;
                case ".":
                    tokens.push({ type: TokenType.DOT, value: singleChar, line, column });
                    break;
                case ":":
                    tokens.push({ type: TokenType.COLON, value: singleChar, line, column });
                    break;
                case "\n":
                    tokens.push({ type: TokenType.NEWLINE, value: singleChar, line, column });
                    break;
                default:
                    throw new Error(`Unexpected character: ${singleChar} at line ${line}, column ${column}`);
            }
        }
        tokens.push({ type: TokenType.EOF, value: "", line: this.line, column: this.column });
        return tokens;
    }
}
exports.Lexer = Lexer;
//# sourceMappingURL=lexer.js.map
