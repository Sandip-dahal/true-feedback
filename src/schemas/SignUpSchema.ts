import {z } from "zod"

export const signUpValidation = z.object({
    name: z
    .string()
    .min(2,"Name must be atLeast 2 character")
    .max(30,"Name must be at1most 30 character")
    .regex(/^[a-zA-Z0-9_]+$/, "UserName must not contain special character"),

    email:z
    .email({message:"INvalid email address"})
    .toLowerCase(),

    password:z
    .string()
    .min(8,{message:"Password must be atleast 8 character"}),


})