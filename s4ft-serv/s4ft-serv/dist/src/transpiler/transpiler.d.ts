import type { S4FTNode } from "../parser/ast.js";
export declare class Transpiler {
    transpile(ast: S4FTNode): string;
    private transpilePage;
    private transpileComponent;
    private generateImports;
    private generatePropsInterface;
    private generateStateHooks;
    private generateEventHandlers;
    private transpileJSX;
    private transpileJSXAttribute;
    private mapType;
    private formatDefaultValue;
}
export declare function transpileS4FT(ast: S4FTNode): string;
