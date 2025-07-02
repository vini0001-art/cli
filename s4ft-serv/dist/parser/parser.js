"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const lexer_js_1 = require("./lexer.js");
class Parser {
    constructor(input) {
        this.current = 0;
        const lexer = new lexer_js_1.Lexer(input);
        this.tokens = lexer.tokenize();
    }
    peek(offset = 0) {
        const index = this.current + offset;
        return index >= this.tokens.length ? this.tokens[this.tokens.length - 1] : this.tokens[index];
    }
    advance() {
        if (this.current < this.tokens.length - 1) {
            this.current++;
        }
        return this.tokens[this.current - 1];
    }
    match(...types) {
        return types.includes(this.peek().type);
    }
    consume(type, message) {
        if (this.peek().type === type) {
            return this.advance();
        }
        const token = this.peek();
        throw new Error(message || `Expected ${type}, got ${token.type} at line ${token.line}, column ${token.column}`);
    }
    skipNewlines() {
        while (this.match(lexer_js_1.TokenType.NEWLINE)) {
            this.advance();
        }
    }
    parse() {
        const body = [];
        this.skipNewlines();
        while (!this.match(lexer_js_1.TokenType.EOF)) {
            const stmt = this.parseStatement();
            if (stmt) {
                body.push(stmt);
            }
            this.skipNewlines();
        }
        return {
            type: "Program",
            body,
        };
    }
    parseStatement() {
        this.skipNewlines();
        if (this.match(lexer_js_1.TokenType.IMPORT)) {
            return this.parseImportStatement();
        }
        if (this.match(lexer_js_1.TokenType.EXPORT)) {
            return this.parseExportStatement();
        }
        if (this.match(lexer_js_1.TokenType.COMPONENT)) {
            return this.parseComponentDeclaration();
        }
        if (this.match(lexer_js_1.TokenType.PAGE)) {
            return this.parsePageDeclaration();
        }
        if (this.match(lexer_js_1.TokenType.LAYOUT)) {
            return this.parseLayoutDeclaration();
        }
        if (this.match(lexer_js_1.TokenType.IF)) {
            return this.parseConditionalStatement();
        }
        if (this.match(lexer_js_1.TokenType.FOR)) {
            return this.parseForStatement();
        }
        // Skip newlines and try again
        if (this.match(lexer_js_1.TokenType.NEWLINE)) {
            this.advance();
            return null;
        }
        throw new Error(`Unexpected token: ${this.peek().type} at line ${this.peek().line}`);
    }
    parseImportStatement() {
        this.consume(lexer_js_1.TokenType.IMPORT);
        const specifiers = [];
        if (this.match(lexer_js_1.TokenType.LEFT_BRACE)) {
            this.advance(); // {
            do {
                const imported = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
                let local = imported;
                if (this.match(lexer_js_1.TokenType.IDENTIFIER) && this.peek().value === "as") {
                    this.advance(); // as
                    local = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
                }
                specifiers.push({
                    type: "ImportSpecifier",
                    imported,
                    local,
                });
                if (this.match(lexer_js_1.TokenType.COMMA)) {
                    this.advance();
                }
                else {
                    break;
                }
            } while (!this.match(lexer_js_1.TokenType.RIGHT_BRACE));
            this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        }
        else {
            const name = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
            specifiers.push({
                type: "ImportSpecifier",
                imported: "default",
                local: name,
            });
        }
        this.consume(lexer_js_1.TokenType.FROM);
        const source = this.consume(lexer_js_1.TokenType.STRING).value;
        return {
            type: "ImportStatement",
            specifiers,
            source,
        };
    }
    parseExportStatement() {
        this.consume(lexer_js_1.TokenType.EXPORT);
        let declaration;
        if (this.match(lexer_js_1.TokenType.COMPONENT)) {
            declaration = this.parseComponentDeclaration();
        }
        else if (this.match(lexer_js_1.TokenType.PAGE)) {
            declaration = this.parsePageDeclaration();
        }
        else if (this.match(lexer_js_1.TokenType.LAYOUT)) {
            declaration = this.parseLayoutDeclaration();
        }
        else {
            throw new Error(`Expected component, page, or layout after export at line ${this.peek().line}`);
        }
        return {
            type: "ExportStatement",
            declaration,
        };
    }
    parseComponentDeclaration() {
        this.consume(lexer_js_1.TokenType.COMPONENT);
        const name = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
        this.consume(lexer_js_1.TokenType.LEFT_BRACE);
        this.skipNewlines();
        const props = [];
        const state = [];
        const events = [];
        while (!this.match(lexer_js_1.TokenType.RIGHT_BRACE)) {
            if (this.match(lexer_js_1.TokenType.PROPS)) {
                props.push(...this.parsePropsSection());
            }
            else if (this.match(lexer_js_1.TokenType.STATE)) {
                state.push(...this.parseStateSection());
            }
            else if (this.match(lexer_js_1.TokenType.EVENT)) {
                events.push(this.parseEventDeclaration());
            }
            else {
                break;
            }
            this.skipNewlines();
        }
        const body = this.parseJSXElement();
        this.skipNewlines();
        this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        return {
            type: "ComponentDeclaration",
            name,
            props,
            state,
            events,
            body,
        };
    }
    parsePageDeclaration() {
        this.consume(lexer_js_1.TokenType.PAGE);
        const name = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
        this.consume(lexer_js_1.TokenType.LEFT_BRACE);
        this.skipNewlines();
        const props = [];
        const state = [];
        const events = [];
        while (!this.match(lexer_js_1.TokenType.RIGHT_BRACE)) {
            if (this.match(lexer_js_1.TokenType.PROPS)) {
                props.push(...this.parsePropsSection());
            }
            else if (this.match(lexer_js_1.TokenType.STATE)) {
                state.push(...this.parseStateSection());
            }
            else if (this.match(lexer_js_1.TokenType.EVENT)) {
                events.push(this.parseEventDeclaration());
            }
            else {
                break;
            }
            this.skipNewlines();
        }
        const body = this.parseJSXElement();
        this.skipNewlines();
        this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        return {
            type: "PageDeclaration",
            name,
            props,
            state,
            events,
            body,
        };
    }
    parseLayoutDeclaration() {
        this.consume(lexer_js_1.TokenType.LAYOUT);
        const name = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
        this.consume(lexer_js_1.TokenType.LEFT_BRACE);
        this.skipNewlines();
        const props = [];
        const state = [];
        const events = [];
        while (!this.match(lexer_js_1.TokenType.RIGHT_BRACE)) {
            if (this.match(lexer_js_1.TokenType.PROPS)) {
                props.push(...this.parsePropsSection());
            }
            else if (this.match(lexer_js_1.TokenType.STATE)) {
                state.push(...this.parseStateSection());
            }
            else if (this.match(lexer_js_1.TokenType.EVENT)) {
                events.push(this.parseEventDeclaration());
            }
            else {
                break;
            }
            this.skipNewlines();
        }
        const body = this.parseJSXElement();
        this.skipNewlines();
        this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        return {
            type: "LayoutDeclaration",
            name,
            props,
            state,
            events,
            body,
        };
    }
    parsePropsSection() {
        this.consume(lexer_js_1.TokenType.PROPS);
        this.consume(lexer_js_1.TokenType.LEFT_BRACE);
        this.skipNewlines();
        const props = [];
        while (!this.match(lexer_js_1.TokenType.RIGHT_BRACE)) {
            const name = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
            this.consume(lexer_js_1.TokenType.COLON);
            const dataType = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
            let defaultValue;
            if (this.match(lexer_js_1.TokenType.ASSIGN)) {
                this.advance();
                defaultValue = this.parseExpression();
            }
            props.push({
                type: "PropDeclaration",
                name,
                dataType,
                defaultValue,
            });
            if (this.match(lexer_js_1.TokenType.COMMA)) {
                this.advance();
            }
            this.skipNewlines();
        }
        this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        return props;
    }
    parseStateSection() {
        this.consume(lexer_js_1.TokenType.STATE);
        this.consume(lexer_js_1.TokenType.LEFT_BRACE);
        this.skipNewlines();
        const state = [];
        while (!this.match(lexer_js_1.TokenType.RIGHT_BRACE)) {
            const name = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
            this.consume(lexer_js_1.TokenType.COLON);
            const dataType = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
            this.consume(lexer_js_1.TokenType.ASSIGN);
            const initialValue = this.parseExpression();
            state.push({
                type: "StateDeclaration",
                name,
                dataType,
                initialValue,
            });
            if (this.match(lexer_js_1.TokenType.COMMA)) {
                this.advance();
            }
            this.skipNewlines();
        }
        this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        return state;
    }
    parseEventDeclaration() {
        this.consume(lexer_js_1.TokenType.EVENT);
        const name = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
        this.consume(lexer_js_1.TokenType.LEFT_PAREN);
        const parameters = [];
        while (!this.match(lexer_js_1.TokenType.RIGHT_PAREN)) {
            const paramName = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
            this.consume(lexer_js_1.TokenType.COLON);
            const dataType = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
            parameters.push({
                type: "Parameter",
                name: paramName,
                dataType,
            });
            if (this.match(lexer_js_1.TokenType.COMMA)) {
                this.advance();
            }
        }
        this.consume(lexer_js_1.TokenType.RIGHT_PAREN);
        this.consume(lexer_js_1.TokenType.LEFT_BRACE);
        this.skipNewlines();
        const body = [];
        // For simplicity, we'll skip parsing the event body for now
        this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        return {
            type: "EventDeclaration",
            name,
            parameters,
            body,
        };
    }
    parseJSXElement() {
        this.consume(lexer_js_1.TokenType.JSX_OPEN);
        const tagName = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
        const attributes = [];
        while (!this.match(lexer_js_1.TokenType.JSX_CLOSE, lexer_js_1.TokenType.JSX_SELF_CLOSE)) {
            const attrName = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
            this.consume(lexer_js_1.TokenType.ASSIGN);
            let value;
            if (this.match(lexer_js_1.TokenType.STRING)) {
                value = this.advance().value;
            }
            else if (this.match(lexer_js_1.TokenType.LEFT_BRACE)) {
                this.advance();
                value = this.parseExpression();
                this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
            }
            else {
                throw new Error(`Expected string or expression for attribute value at line ${this.peek().line}`);
            }
            attributes.push({
                type: "JSXAttribute",
                name: attrName,
                value,
            });
        }
        if (this.match(lexer_js_1.TokenType.JSX_SELF_CLOSE)) {
            this.advance();
            return {
                type: "JSXElement",
                tagName,
                attributes,
                children: [],
                selfClosing: true,
            };
        }
        this.consume(lexer_js_1.TokenType.JSX_CLOSE);
        const children = [];
        while (!this.match(lexer_js_1.TokenType.JSX_END_OPEN)) {
            if (this.match(lexer_js_1.TokenType.JSX_OPEN)) {
                children.push(this.parseJSXElement());
            }
            else if (this.match(lexer_js_1.TokenType.LEFT_BRACE)) {
                this.advance();
                const expression = this.parseExpression();
                this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
                children.push({
                    type: "JSXExpression",
                    expression,
                });
            }
            else {
                // Parse text content
                let text = "";
                while (!this.match(lexer_js_1.TokenType.JSX_OPEN, lexer_js_1.TokenType.JSX_END_OPEN, lexer_js_1.TokenType.LEFT_BRACE, lexer_js_1.TokenType.EOF)) {
                    text += this.advance().value;
                }
                if (text.trim()) {
                    children.push({
                        type: "JSXText",
                        value: text.trim(),
                    });
                }
            }
        }
        this.consume(lexer_js_1.TokenType.JSX_END_OPEN);
        this.consume(lexer_js_1.TokenType.IDENTIFIER); // Should match opening tag
        this.consume(lexer_js_1.TokenType.JSX_CLOSE);
        return {
            type: "JSXElement",
            tagName,
            attributes,
            children,
            selfClosing: false,
        };
    }
    parseExpression() {
        return this.parseBinaryExpression();
    }
    parseBinaryExpression() {
        let left = this.parsePrimaryExpression();
        while (this.match(lexer_js_1.TokenType.PLUS, lexer_js_1.TokenType.MINUS, lexer_js_1.TokenType.MULTIPLY, lexer_js_1.TokenType.DIVIDE, lexer_js_1.TokenType.EQUALS, lexer_js_1.TokenType.NOT_EQUALS)) {
            const operator = this.advance().value;
            const right = this.parsePrimaryExpression();
            left = {
                type: "BinaryExpression",
                left,
                operator,
                right,
            };
        }
        return left;
    }
    parsePrimaryExpression() {
        if (this.match(lexer_js_1.TokenType.IDENTIFIER)) {
            const name = this.advance().value;
            if (this.match(lexer_js_1.TokenType.LEFT_PAREN)) {
                // Function call
                this.advance();
                const args = [];
                while (!this.match(lexer_js_1.TokenType.RIGHT_PAREN)) {
                    args.push(this.parseExpression());
                    if (this.match(lexer_js_1.TokenType.COMMA)) {
                        this.advance();
                    }
                }
                this.consume(lexer_js_1.TokenType.RIGHT_PAREN);
                return {
                    type: "CallExpression",
                    callee: { type: "Identifier", name },
                    arguments: args,
                };
            }
            return { type: "Identifier", name };
        }
        if (this.match(lexer_js_1.TokenType.STRING)) {
            const value = this.advance().value;
            return { type: "Literal", value, raw: `"${value}"` };
        }
        if (this.match(lexer_js_1.TokenType.NUMBER)) {
            const raw = this.advance().value;
            const value = Number.parseFloat(raw);
            return { type: "Literal", value, raw };
        }
        if (this.match(lexer_js_1.TokenType.BOOLEAN)) {
            const raw = this.advance().value;
            const value = raw === "true";
            return { type: "Literal", value, raw };
        }
        if (this.match(lexer_js_1.TokenType.LEFT_PAREN)) {
            this.advance();
            const expr = this.parseExpression();
            this.consume(lexer_js_1.TokenType.RIGHT_PAREN);
            return expr;
        }
        throw new Error(`Unexpected token in expression: ${this.peek().type} at line ${this.peek().line}`);
    }
    parseConditionalStatement() {
        this.consume(lexer_js_1.TokenType.IF);
        this.consume(lexer_js_1.TokenType.LEFT_PAREN);
        const test = this.parseExpression();
        this.consume(lexer_js_1.TokenType.RIGHT_PAREN);
        this.consume(lexer_js_1.TokenType.LEFT_BRACE);
        const consequent = [];
        while (!this.match(lexer_js_1.TokenType.RIGHT_BRACE)) {
            const stmt = this.parseStatement();
            if (stmt)
                consequent.push(stmt);
        }
        this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        let alternate;
        if (this.match(lexer_js_1.TokenType.ELSE)) {
            this.advance();
            this.consume(lexer_js_1.TokenType.LEFT_BRACE);
            alternate = [];
            while (!this.match(lexer_js_1.TokenType.RIGHT_BRACE)) {
                const stmt = this.parseStatement();
                if (stmt)
                    alternate.push(stmt);
            }
            this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        }
        return {
            type: "ConditionalStatement",
            test,
            consequent,
            alternate,
        };
    }
    parseForStatement() {
        this.consume(lexer_js_1.TokenType.FOR);
        this.consume(lexer_js_1.TokenType.LEFT_PAREN);
        const variable = this.consume(lexer_js_1.TokenType.IDENTIFIER).value;
        this.consume(lexer_js_1.TokenType.IN);
        const iterable = this.parseExpression();
        this.consume(lexer_js_1.TokenType.RIGHT_PAREN);
        this.consume(lexer_js_1.TokenType.LEFT_BRACE);
        const body = [];
        while (!this.match(lexer_js_1.TokenType.RIGHT_BRACE)) {
            const stmt = this.parseStatement();
            if (stmt)
                body.push(stmt);
        }
        this.consume(lexer_js_1.TokenType.RIGHT_BRACE);
        return {
            type: "ForStatement",
            variable,
            iterable,
            body,
        };
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map
