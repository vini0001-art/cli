import * as AST from "../parser/ast.js";
export declare class Transpiler {
    private indentLevel;
    private indent;
    private increaseIndent;
    private decreaseIndent;
    transpile(ast: AST.Program): string;
    private transpileStatement;
    private transpileImportStatement;
    private transpileExportStatement;
    private transpileComponentDeclaration;
    private transpilePageDeclaration;
    private transpileLayoutDeclaration;
    private transpileJSXElement;
    private transpileExpression;
    private capitalize;
}
//# sourceMappingURL=transpiler.d.ts.map