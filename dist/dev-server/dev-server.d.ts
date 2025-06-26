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
    private setupMiddleware;
    private setupBundleRoute;
    private setupRoutes;
    private generateIndexHTML;
    private handleAPIRoutes;
    private handlePageRoutes;
    private setupWebSocket;
    private setupFileWatcher;
    private notifyClients;
    private getAppBundle;
    private finds4ftFiles;
    start(): Promise<void>;
    stop(): void;
}
//# sourceMappingURL=dev-server.d.ts.map