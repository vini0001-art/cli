import chalk from "chalk";
// Middleware de logging
export function loggingMiddleware(req, res, next) {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);
    req.s4ft = {
        startTime,
        requestId,
    };
    // Log da requisição
    console.log(chalk.blue(`[${requestId}] ${req.method} ${req.url}`));
    // Log da resposta
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const statusColor = res.statusCode >= 400 ? chalk.red : res.statusCode >= 300 ? chalk.yellow : chalk.green;
        console.log(chalk.gray(`[${requestId}]`) + statusColor(` ${res.statusCode}`) + chalk.gray(` ${duration}ms`));
    });
    next();
}
// Middleware de CORS
export function corsMiddleware(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    }
    else {
        next();
    }
}
// Middleware de parsing JSON
export function jsonMiddleware(req, res, next) {
    var _a;
    if ((_a = req.headers["content-type"]) === null || _a === void 0 ? void 0 : _a.includes("application/json")) {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            try {
                req.body = JSON.parse(body);
                next();
                next();
            }
            catch (error) {
                res.status(400).json({ error: "Invalid JSON" });
            }
        });
    }
    else {
        next();
    }
}
// Middleware de tratamento de erros
export function errorMiddleware(error, req, res, next) {
    console.error(chalk.red("Error:"), error.message);
    console.error(error.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    });
}
// Middleware principal que combina todos
export default function middleware(req, res, next) {
    // Aplicar middlewares em sequência
    loggingMiddleware(req, res, () => {
        corsMiddleware(req, res, () => {
            jsonMiddleware(req, res, next);
        });
    });
}
