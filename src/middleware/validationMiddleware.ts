import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError, ZodObject } from "zod";

interface ValidationSchemas {
    body?: ZodObject;
    query?: ZodObject;
    params?: ZodObject;
    headers?: ZodObject;
}

/**
 * Validates that network request matches the given schemas.
 *
 * @param schemas @link{ValidationSchemas}
 * @returns RequestHandler
 */
export function validateRequest(schemas: ValidationSchemas): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated: Record<string, unknown> = {};
            if (schemas.body) {
                validated.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                validated.query = await schemas.query.parseAsync(req.query);
            }
            if (schemas.params) {
                validated.params = await schemas.params.parseAsync(req.params);
            }
            if (schemas.headers) {
                validated.headers = await schemas.headers.parseAsync(req.headers);
            }

            req.validated = validated;
            return next();
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    message: 'Validation failed',
                    issues: err.issues,
                })
            } else {
                return res.status(400).json({ message: 'Bad Request' });
            }
        }
    }
}
