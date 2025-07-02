export var TokenType;
(function (TokenType) {
    // Literals
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["STRING"] = "STRING";
    TokenType["NUMBER"] = "NUMBER";
    TokenType["BOOLEAN"] = "BOOLEAN";
    // Keywords
    TokenType["PAGE"] = "PAGE";
    TokenType["COMPONENT"] = "COMPONENT";
    TokenType["STATE"] = "STATE";
    TokenType["EVENT"] = "EVENT";
    TokenType["PROPS"] = "PROPS";
    // Operators
    TokenType["ASSIGN"] = "=";
    TokenType["PLUS"] = "+";
    TokenType["MINUS"] = "-";
    TokenType["MULTIPLY"] = "*";
    TokenType["DIVIDE"] = "/";
    // Delimiters
    TokenType["LPAREN"] = "(";
    TokenType["RPAREN"] = ")";
    TokenType["LBRACE"] = "{";
    TokenType["RBRACE"] = "}";
    TokenType["LBRACKET"] = "[";
    TokenType["RBRACKET"] = "]";
    TokenType["SEMICOLON"] = ";";
    TokenType["COMMA"] = ",";
    TokenType["COLON"] = ":";
    TokenType["DOT"] = ".";
    // JSX
    TokenType["JSX_OPEN"] = "<";
    TokenType["JSX_CLOSE"] = ">";
    TokenType["JSX_SELF_CLOSE"] = "/>";
    TokenType["JSX_END_OPEN"] = "</";
    // Special
    TokenType["EOF"] = "EOF";
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["WHITESPACE"] = "WHITESPACE";
})(TokenType || (TokenType = {}));
export class Lexer {
    constructor(input) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.input = input;
    }
    tokenize() {
        const tokens = [];
        while (this.position < this.input.length) {
            const token = this.s4ftToken();
            if (token.type !== TokenType.WHITESPACE) {
                tokens.push(token);
            }
        }
        tokens.push({
            type: TokenType.EOF,
            value: "",
            line: this.line,
            column: this.column,
        });
        return tokens;
    }
    s4ftToken() {
        this.skipWhitespace();
        if (this.position >= this.input.length) {
            return this.createToken(TokenType.EOF, "");
        }
        const char = this.input[this.position];
        // Numbers
        if (this.isDigit(char)) {
            return this.readNumber();
        }
        // Strings
        if (char === '"' || char === "'") {
            return this.readString();
        }
        // Identifiers and keywords
        if (this.isLetter(char) || char === "_") {
            return this.readIdentifier();
        }
        // JSX tags
        if (char === "<") {
            if (this.peek() === "/") {
                this.advance();
                this.advance();
                return this.createToken(TokenType.JSX_END_OPEN, "</");
            }
            this.advance();
            return this.createToken(TokenType.JSX_OPEN, "<");
        }
        if (char === ">" || (char === "/" && this.peek() === ">")) {
            if (char === "/" && this.peek() === ">") {
                this.advance();
                this.advance();
                return this.createToken(TokenType.JSX_SELF_CLOSE, "/>");
            }
            this.advance();
            return this.createToken(TokenType.JSX_CLOSE, ">");
        }
        // Single character tokens
        const singleChar = this.getSingleCharToken(char);
        if (singleChar) {
            this.advance();
            return this.createToken(singleChar, char);
        }
        // Unknown character
        this.advance();
        return this.createToken(TokenType.IDENTIFIER, char);
    }
    readNumber() {
        const start = this.position;
        while (this.isDigit(this.input[this.position]) || this.input[this.position] === ".") {
            this.advance();
        }
        const value = this.input.slice(start, this.position);
        return this.createToken(TokenType.NUMBER, value);
    }
    readString() {
        const quote = this.input[this.position];
        this.advance(); // Skip opening quote
        const start = this.position;
        while (this.position < this.input.length && this.input[this.position] !== quote) {
            if (this.input[this.position] === "\\") {
                this.advance(); // Skip escape character
            }
            this.advance();
        }
        const value = this.input.slice(start, this.position);
        this.advance(); // Skip closing quote
        return this.createToken(TokenType.STRING, value);
    }
    readIdentifier() {
        const start = this.position;
        while (this.isAlphaNumeric(this.input[this.position])) {
            this.advance();
        }
        const value = this.input.slice(start, this.position);
        const type = this.getKeywordType(value) || TokenType.IDENTIFIER;
        return this.createToken(type, value);
    }
    getKeywordType(value) {
        const keywords = {
            page: TokenType.PAGE,
            component: TokenType.COMPONENT,
            state: TokenType.STATE,
            event: TokenType.EVENT,
            props: TokenType.PROPS,
            true: TokenType.BOOLEAN,
            false: TokenType.BOOLEAN,
        };
        return keywords[value] || null;
    }
    getSingleCharToken(char) {
        const tokens = {
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
        };
        return tokens[char] || null;
    }
    skipWhitespace() {
        while (this.position < this.input.length && this.isWhitespace(this.input[this.position])) {
            if (this.input[this.position] === "\n") {
                this.line++;
                this.column = 1;
            }
            else {
                this.column++;
            }
            this.position++;
        }
    }
    advance() {
        if (this.position < this.input.length) {
            if (this.input[this.position] === "\n") {
                this.line++;
                this.column = 1;
            }
            else {
                this.column++;
            }
            this.position++;
        }
    }
    peek() {
        return this.input[this.position + 1] || "";
    }
    createToken(type, value) {
        return {
            type,
            value,
            line: this.line,
            column: this.column,
        };
    }
    isDigit(char) {
        return /[0-9]/.test(char);
    }
    isLetter(char) {
        return /[a-zA-Z]/.test(char);
    }
    isAlphaNumeric(char) {
        return this.isLetter(char) || this.isDigit(char) || char === "_";
    }
    isWhitespace(char) {
        return /\s/.test(char);
    }
}
