"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const parser_js_1 = require("../parser/parser.js");
const terser_1 = require("terser");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class Builder {
    constructor(transpiler, options) {
        this.transpiler = transpiler;
        this.options = options;
    }
    run() {
        // Implementação básica, pode ser expandida conforme necessário
        console.log("Método run chamado. Implemente a lógica de build aqui.");
    }
    // ...existing code...
    async builds4ftFile(filePath, category) {
        try {
            const content = await fs_extra_1.default.readFile(filePath, "utf-8");
            const parser = new parser_js_1.Parser(content);
            const ast = parser.parse();
            if (!this.transpiler) {
                throw new Error("Transpiler não definido.");
            }
            let jsCode = this.transpiler.transpile(ast);
            // Minificar se habilitado
            if (this.options.minify) {
                const minified = await (0, terser_1.minify)(jsCode, {
                    sourceMap: this.options.sourceMaps,
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                    },
                    mangle: true,
                });
                jsCode = minified.code || jsCode;
                if (this.options.sourceMaps && minified.map) {
                    const mapPath = this.getOutputPath(filePath, category, ".js.map");
                    await fs_extra_1.default.ensureDir(path_1.default.dirname(mapPath));
                    await fs_extra_1.default.writeFile(mapPath, JSON.stringify(minified.map));
                }
            }
            const outputPath = this.getOutputPath(filePath, category, ".js");
            await fs_extra_1.default.ensureDir(path_1.default.dirname(outputPath));
            await fs_extra_1.default.writeFile(outputPath, jsCode);
        }
        catch (error) {
            console.error(`❌ Erro ao construir ${filePath}:`, (error === null || error === void 0 ? void 0 : error.message) || error);
            throw error;
        }
    }
    // ...existing code...
    /**
     * Retorna o caminho de saída para um arquivo de entrada, categoria e extensão.
     * Agora a pasta 'dist' fica na raiz do projeto.
     */
    getOutputPath(filePath, category, extension) {
        const projectRoot = process.cwd();
        const relPath = path_1.default.relative(projectRoot, filePath);
        const base = path_1.default.basename(filePath, path_1.default.extname(filePath));
        // Exemplo: saída para '<root>/dist/<categoria>/<relPath sem nome do arquivo>/<arquivo>.ext'
        return path_1.default.join(projectRoot, 'dist', category, path_1.default.dirname(relPath), base + extension);
    }
}
exports.Builder = Builder;
//# sourceMappingURL=builder.js.map