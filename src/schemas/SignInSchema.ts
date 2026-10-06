import {z } from "zod"

export const signInValidation = z.object({
    email: z
    .string()
    .email(),

    password:z
    .string()
    .min(8,{message:"password must be at least 8 character"}),
    
})

