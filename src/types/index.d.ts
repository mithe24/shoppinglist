import { ShoppingList } from "@prisma/client";
import Express from "express";

declare global {
    namespace Express {
        interface Request {
            validated?: {
                body?: unknown;
                query?: unknown;
                params?: unknown;
                headers?: unknown;
            };
            userId: number;
            shoppingList?: ShoppingList;
        }
    }
}
