import {z } from "zod"

export const signInValidation = z.object({
    email: z
    .email(),

    password:z
    .string()
    .min(8,{message:"passworf must be atleast 8 character"}),
    
})