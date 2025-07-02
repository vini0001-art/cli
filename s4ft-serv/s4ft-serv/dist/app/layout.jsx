import "./globals.css";
export const metadata = {
    title: 'S4FT App',
    description: 'Aplicação criada com o S4FT Framework. Simples, rápida e moderna para web.'
};
export const viewport = {
    themeColor: "#0ea5e9"
};
// Corrigir a declaração do componente:
export default function RootLayout({ children, }) {
    return (<html lang="pt-BR">
      <body>{children}</body>
    </html>);
}
