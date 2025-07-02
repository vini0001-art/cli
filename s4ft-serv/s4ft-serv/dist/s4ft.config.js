// Configuração padrão do S4FT
const defaultConfig = {
    paths: {
        appDir: "../app",
        pagesDir: "../pages",
        componentsDir: "../components",
        publicDir: "../public",
        stylesDir: "../styles"
    },
    build: {
        outDir: "dist",
        minify: true,
        sourceMaps: false,
        target: "es2020",
        splitting: true,
        treeshaking: true,
    },
    dev: {
        port: 3000,
        host: "localhost",
        open: true,
        https: false,
    },
    deploy: {
        target: "s4ft-cloud",
    },
    css: {
        postcss: true,
        tailwind: true,
    },
    typescript: {
        strict: true,
        target: "es2020",
        lib: ["dom", "es2020"],
    },
    plugins: [],
};
export default defaultConfig;
