#!/usr/bin/env node

import { findFreePort } from "../dist/dev-server/findFreePort.js";
import { DevServer } from "../dist/dev-server/dev-server.js";
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
