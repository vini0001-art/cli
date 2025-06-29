import { Request, Response, NextFunction } from "express";

// Middleware padrão: você pode personalizar a lógica aqui
export default function middleware(req: Request, res: Response, next: NextFunction) {
  // Exemplo: log de requisições
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // Você pode adicionar autenticação, headers, etc.
  next();
}