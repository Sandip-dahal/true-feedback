import {z } from "zod"

export const userNameValidation = z
    .string()
    .min(2,"userName must be at least 2 character")
    .max(30, "Username must be atMost 30 character")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpValidation = z.object({
    username: userNameValidation,
    
    name: z
    .string()
    .min(2,"Name must be atLeast 2 character")
    .max(30,"Name must be at1most 30 character")
    .regex(/^[a-zA-Z0-9_ ]+$/, "name must not contain special character"),

    email:z
    .email({message:"Invalid email address"})
    .toLowerCase(),

    password:z
    .string()
    .min(8,{message:"Password must be atleast 8 character"}),


})