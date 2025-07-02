export interface S4FTConfig {
    paths?: {
        appDir?: string;
        pagesDir?: string;
        componentsDir?: string;
        publicDir?: string;
        stylesDir?: string;
    };
    name?: string;
    version?: string;
    description?: string;
    build?: {
        outDir?: string;
        minify?: boolean;
        sourceMaps?: boolean;
        target?: "es5" | "es2015" | "es2017" | "es2018" | "es2019" | "es2020" | "ess4ft";
        splitting?: boolean;
        treeshaking?: boolean;
    };
    dev?: {
        port?: number;
        host?: string;
        open?: boolean;
        https?: boolean;
        proxy?: Record<string, string>;
    };
    deploy?: {
        target?: "s4ft-cloud" | "vercel" | "netlify" | "github-pages";
        domain?: string;
        env?: Record<string, string>;
    };
    plugins?: (string | [string, any])[];
    css?: {
        preprocessor?: "sass" | "less" | "stylus";
        postcss?: boolean;
        tailwind?: boolean;
    };
    typescript?: {
        strict?: boolean;
        target?: string;
        lib?: string[];
    };
    pwa?: {
        name?: string;
        shortName?: string;
        description?: string;
        themeColor?: string;
        backgroundColor?: string;
        icons?: Array<{
            src: string;
            sizes: string;
            type: string;
        }>;
    };
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        author?: string;
        image?: string;
    };
    analytics?: {
        google?: string;
        vercel?: boolean;
        plausible?: string;
    };
    auth?: {
        providers?: ("google" | "github" | "facebook" | "auth0")[];
        redirectUrl?: string;
        secret?: string;
    };
    database?: {
        provider?: "supabase" | "planetscale" | "mongodb" | "postgresql";
        url?: string;
        migrations?: string;
    };
}
declare const defaultConfig: S4FTConfig;
export default defaultConfig;
