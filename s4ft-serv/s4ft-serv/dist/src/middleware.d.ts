import type { Request, Response } from "express";
interface S4FTRequest extends Request {
    s4ft?: {
        startTime: number;
        requestId: string;
    };
}
export declare function loggingMiddleware(req: S4FTRequest, res: Response, next: () => void): void;
export declare function corsMiddleware(req: Request, res: Response, next: () => void): void;
export declare function jsonMiddleware(req: Request, res: Response, next: () => void): void;
export declare function errorMiddleware(error: Error, req: Request, res: Response, next: () => void): void;
export default function middleware(req: S4FTRequest, res: Response, next: () => void): void;
export {};
