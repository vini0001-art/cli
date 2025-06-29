export interface DevServerOptions {
    port: number;
    projectRoot: string;
    appDir: string;
}
export declare class DevServer {
    private app;
    private server;
    private wss;
    private options;
    private transpiler;
    constructor(options: DevServerOptions);
    private loadConfig;
    private setupMiddleware;
    private setupBundleRoute;
    private setupRoutes;
    private generateIndexHTML;
    private handleAPIRoutes;
    private matchDynamicRoute;
    private handlePageRoutes;
    private setupWebSocket;
    private setupFileWatcher;
    private notifyClients;
    private getAppBundle;
    private finds4ftFiles;
    private setupPlugins;
    start(): Promise<void>;
    stop(): void;
}
export declare function getServerSideProps(context: any): Promise<{
    props: {};
}>;
//# sourceMappingURL=dev-server.d.ts.map