import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { parseS4FT } from "../parser/parser.js";
import { transpileS4FT } from "../transpiler/transpiler.js";
export async function buildProject() {
    console.log(chalk.blue("📦 Iniciando build do projeto S4FT..."));
    const buildDir = path.join(process.cwd(), "dist");
    await fs.ensureDir(buildDir);
    // Limpar diretório de build
    await fs.emptyDir(buildDir);
    // Encontrar todos os arquivos .s4ft
    const s4ftFiles = await findS4FTFiles();
    console.log(chalk.cyan(`📄 Encontrados ${s4ftFiles.length} arquivos .s4ft`));
    // Transpilar cada arquivo
    for (const filePath of s4ftFiles) {
        try {
            await transpileFile(filePath, buildDir);
            console.log(chalk.green(`✅ ${filePath}`));
        }
        catch (error) {
            console.error(chalk.red(`❌ Erro em ${filePath}:`), error);
        }
    }
    // Copiar arquivos estáticos
    await copyStaticFiles(buildDir);
    // Gerar package.json para build
    await generateBuildPackageJson(buildDir);
    console.log(chalk.green.bold("✅ Build concluído!"));
    console.log(chalk.cyan(`📁 Arquivos gerados em: ${buildDir}`));
}
async function findS4FTFiles() {
    const files = [];
    const searchDirs = ["app", "components", "pages"];
    for (const dir of searchDirs) {
        const dirPath = path.join(process.cwd(), dir);
        if (await fs.pathExists(dirPath)) {
            const dirFiles = await findFilesRecursive(dirPath, ".s4ft");
            files.push(...dirFiles);
        }
    }
    return files;
}
async function findFilesRecursive(dir, extension) {
    const files = [];
    const items = await fs.readdir(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
            const subFiles = await findFilesRecursive(fullPath, extension);
            files.push(...subFiles);
        }
        else if (item.endsWith(extension)) {
            files.push(fullPath);
        }
    }
    return files;
}
async function transpileFile(filePath, buildDir) {
    const content = await fs.readFile(filePath, "utf-8");
    const ast = parseS4FT(content);
    const reactCode = transpileS4FT(ast);
    // Determinar caminho de saída
    const relativePath = path.relative(process.cwd(), filePath);
    const outputPath = path.join(buildDir, relativePath.replace(".s4ft", ".tsx"));
    // Garantir que o diretório existe
    await fs.ensureDir(path.dirname(outputPath));
    // Escrever arquivo transpilado
    await fs.writeFile(outputPath, reactCode);
}
async function copyStaticFiles(buildDir) {
    const staticDirs = ["public", "assets", "styles"];
    for (const dir of staticDirs) {
        const srcPath = path.join(process.cwd(), dir);
        const destPath = path.join(buildDir, dir);
        if (await fs.pathExists(srcPath)) {
            await fs.copy(srcPath, destPath);
            console.log(chalk.gray(`📁 Copiado: ${dir}/`));
        }
    }
    // Copiar arquivos de configuração importantes
    const configFiles = ["package.json", "tsconfig.json", "tailwind.config.js", "s4ft.config.ts"];
    for (const file of configFiles) {
        const srcPath = path.join(process.cwd(), file);
        const destPath = path.join(buildDir, file);
        if (await fs.pathExists(srcPath)) {
            await fs.copy(srcPath, destPath);
            console.log(chalk.gray(`📄 Copiado: ${file}`));
        }
    }
}
async function generateBuildPackageJson(buildDir) {
    const originalPackageJson = await fs.readJson(path.join(process.cwd(), "package.json"));
    const buildPackageJson = Object.assign(Object.assign({}, originalPackageJson), { scripts: {
            start: "s4ft start",
            build: "s4ft build",
            dev: "s4ft dev",
        }, devDependencies: Object.assign(Object.assign({}, originalPackageJson.devDependencies), { s4ft: "^14.0.0", react: "^18.0.0", "react-dom": "^18.0.0", typescript: "^5.0.0" }) });
    await fs.writeJson(path.join(buildDir, "package.json"), buildPackageJson, { spaces: 2 });
}
