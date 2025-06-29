// Middleware básico de exemplo
import { Request, Response, NextFunction } from "express";

export default function middleware(req: Request, res: Response, next: NextFunction) {
  // Middleware genérico (pode customizar)
  next();
}
