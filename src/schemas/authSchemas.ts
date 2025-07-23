import z from "zod";

export const authHeaderSchema = z.object({
    authorization: z.string().refine((val) => val.startsWith('Bearer' ), {
        message: "Authorization header must start with 'Bearer '",
    }),
});

export const idScema = z.object({
    id: z.number().int().positive(),
});

