import { Parser } from "../parser/parser.js";
import * as AST from "../parser/ast.js";
import { minify } from "terser";
import fs from "fs-extra";
import path from "path";

// Interface para o transpiler
interface Transpiler {
  transpile(ast: any): string;
}

interface BuilderOptions {
  minify: boolean;
  sourceMaps: boolean;
  // ...outras opções...
}

export class Builder {
  private transpiler: Transpiler;
  private options: BuilderOptions;

  constructor(transpiler: Transpiler, options: BuilderOptions) {
    this.transpiler = transpiler;
    this.options = options;
  }

  run() {
    // Implementação básica, pode ser expandida conforme necessário
    console.log("Método run chamado. Implemente a lógica de build aqui.");
  }

  // ...existing code...

  public async builds4ftFile(filePath: string, category: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const parser = new Parser(content);
      const ast = parser.parse();

      if (!this.transpiler) {
        throw new Error("Transpiler não definido.");
      }

      let jsCode = this.transpiler.transpile(ast);

      // Minificar se habilitado
      if (this.options.minify) {
        const minified = await minify(jsCode, {
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
          await fs.ensureDir(path.dirname(mapPath));
          await fs.writeFile(mapPath, JSON.stringify(minified.map));
        }
      }

      const outputPath = this.getOutputPath(filePath, category, ".js");
      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeFile(outputPath, jsCode);
    } catch (error: any) {
      console.error(`❌ Erro ao construir ${filePath}:`, error?.message || error);
      throw error;
    }
  }

  // ...existing code...

  /**
   * Retorna o caminho de saída para um arquivo de entrada, categoria e extensão.
   * Agora a pasta 'dist' fica na raiz do projeto.
   */
  private getOutputPath(filePath: string, category: string, extension: string): string {
    const projectRoot = process.cwd();
    const relPath = path.relative(projectRoot, filePath);
    const base = path.basename(filePath, path.extname(filePath));
    // Exemplo: saída para '<root>/dist/<categoria>/<relPath sem nome do arquivo>/<arquivo>.ext'
    return path.join(projectRoot, 'dist', category, path.dirname(relPath), base + extension);
  }
}
