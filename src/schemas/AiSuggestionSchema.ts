import { z} from "zod"

export const aiSuggestionSchema = z.object({
    topic: z
    .string()
    .min(2,"Topic must be at least 2 character")
    .max(100,"Topic must not Exceed 100 character")
    .trim(),

    tone: z
    .enum([
        "friendly",
        "casual",
        "constructive",
        "honest"
    ])
})