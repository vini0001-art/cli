import * as AST from "./ast.js";
export declare class Parser {
    private tokens;
    private current;
    constructor(input: string);
    private peek;
    private advance;
    private match;
    private consume;
    private skipNewlines;
    parse(): AST.Program;
    private parseStatement;
    private parseImportStatement;
    private parseExportStatement;
    private parseComponentDeclaration;
    private parsePageDeclaration;
    private parseLayoutDeclaration;
    private parsePropsSection;
    private parseStateSection;
    private parseEventDeclaration;
    private parseJSXElement;
    private parseExpression;
    private parseBinaryExpression;
    private parsePrimaryExpression;
    private parseConditionalStatement;
    private parseForStatement;
}
//# sourceMappingURL=parser.d.ts.map