#!/usr/bin/env node

import { findFreePort } from "../dev-server/findFreePort"; // ajuste o caminho conforme sua estrutura
import DevServer from "../dev-server/DevServer"; // ajuste o caminho conforme sua estrutura
import path from "path";

async function startDevServer() {
  const port = await findFreePort(3000, 3100);
  const server = new DevServer({
    projectRoot: process.cwd(),
    appDir: path.join(process.cwd(), "app"),
    port
  });
  await server.start();
  console.log(`🚀 s4ft dev servidor em execução em http://localhost:${port}`);
}

startDevServer();
