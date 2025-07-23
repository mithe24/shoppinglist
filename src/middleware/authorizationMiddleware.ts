import { NextFunction, Request, RequestHandler, Response } from "express";
import { validateRequest } from "./validationMiddleware.js";
import jwt from 'jsonwebtoken';
import prisma from "../prismaClient.js";
import { authHeaderSchema, idScema } from "../schemas/authSchemas.js";

interface JwtPayload {
    userId: number;
}

export function authenticateJWT(): RequestHandler {
    const validateAuthHeader: RequestHandler = validateRequest({ headers: authHeaderSchema });

    return (req: Request, res: Response, next: NextFunction) => {
        validateAuthHeader(req, res, (err) => {
            if (err) return; // ValidateRequest already handled the error response

            try {
                const authHeader = req.headers.authorization!;
                const token = authHeader.split(' ')[1];

                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
                req.userId = decoded.userId;

                next();
            } catch {
                res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
        });
    };
}

export function authentcateAdminAPItoken(): RequestHandler {
    const validateAuthHeader: RequestHandler = validateRequest({ headers: authHeaderSchema });

    return (req: Request, res: Response, next: NextFunction) => {
        validateAuthHeader(req, res, (err) => {
            if (err) return; // ValidateRequest already handled the error response

            try {
                const authHeader = req.headers.authorization!;
                const token = authHeader.split(' ')[1];

                if (token != process.env.ADMIN_API_KEY) {
                    res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }

                next();
            } catch {
                res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
        });
    }
}

export function authorizeshoppingListAccess(): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: shoppingListId } = idScema.parse({
                id: req.params.id || req.body.shoppingListId,
            });

            const list = await prisma.shoppingList.findUnique({
                where: { id: shoppingListId },
                include: { collaborators: { select: { id: true }, }, },
            });

            if (!list) return res.status(404).json({ message: 'List not found' });

            const userId = req.userId;
            const isCreator = list.creatorId === userId;
            const isCollaborator = list.collaborators.some((c) => c.id === userId); 

            if (!isCreator && !isCollaborator) {
                return res.status(400).json({ message: 'forbidden' });
            }

            req.shoppingList = list;
            next();
        } catch {
            return res.status(400).json({ message: 'Invalid shopping list ID' });
        }
    };
}

