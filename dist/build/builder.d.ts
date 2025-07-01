interface Transpiler {
    transpile(ast: any): string;
}
interface BuilderOptions {
    minify: boolean;
    sourceMaps: boolean;
}
export declare class Builder {
    private transpiler;
    private options;
    constructor(transpiler: Transpiler, options: BuilderOptions);
    run(): void;
    builds4ftFile(filePath: string, category: string): Promise<void>;
    /**
     * Retorna o caminho de saída para um arquivo de entrada, categoria e extensão.
     * Agora a pasta 'dist' fica na raiz do projeto.
     */
    private getOutputPath;
}
export {};
//# sourceMappingURL=builder.d.ts.map
