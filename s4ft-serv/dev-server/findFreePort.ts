import net from "net";

export async function findFreePort(startPort = 3000, maxPort = 3100): Promise<number> {
  function check(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once("error", () => resolve(false));
      server.once("listening", () => {
        server.close(() => resolve(true));
      });
      server.listen(port);
    });
  }
  for (let port = startPort; port <= maxPort; port++) {
    if (await check(port)) return port;
  }
  throw new Error(`Nenhuma porta livre encontrada entre ${startPort} e ${maxPort}`);
}
