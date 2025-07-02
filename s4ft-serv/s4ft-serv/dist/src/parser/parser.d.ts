import { type Token } from "./lexer.js";
import type { S4FTNode } from "./ast.js";
export declare class Parser {
    private tokens;
    private current;
    constructor(tokens: Token[]);
    parse(): S4FTNode;
    private parsePage;
    private parseComponent;
    private parseProps;
    private parseState;
    private parseEvent;
    private parseJSXElement;
    private parseType;
    private parseValue;
    private parseArray;
    private parseObject;
    private match;
    private check;
    private advance;
    private isAtEnd;
    private peek;
    private previous;
    private consume;
    private parsePrimaryExpression;
}
export declare function parseS4FT(input: string): S4FTNode;
