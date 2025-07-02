// Configuração mínima do S4FT Framework
module.exports = {
  appDir: "app", // Diretório principal das páginas
  publicDir: "public", // Diretório de arquivos estáticos
  componentsDir: "components", // Diretório de componentes reutilizáveis
  stylesDir: "styles", // Diretório de estilos globais
  language: "pt-br", // Idioma padrão
  ssr: true, // Habilita Server Side Rendering
  pwa: true, // Habilita PWA
  ai: {
    enable: true // IA Grok ativada por padrão
  }
};
