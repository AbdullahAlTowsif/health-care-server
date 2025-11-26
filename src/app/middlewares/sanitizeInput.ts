// src/app/middlewares/sanitizeInput.ts
import { Request, Response, NextFunction } from 'express';

const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    // Sanitize query parameters
    if (req.query) {
        const sanitizedQuery: any = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (typeof value === 'string') {
                sanitizedQuery[key] = value.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            } else {
                sanitizedQuery[key] = value;
            }
        }
        // Assign to a custom property instead of modifying req.query directly
        (req as any).sanitizedQuery = sanitizedQuery;
    }

    // Sanitize body parameters
    if (req.body) {
        const sanitizedBody: any = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                sanitizedBody[key] = value.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            } else {
                sanitizedBody[key] = value;
            }
        }
        req.body = sanitizedBody;
    }

    next();
};

export default sanitizeInput;