import { z } from "zod"


export const suggestAfterAiSchema =z.object({
    suggestion:z.array(z.string()).length(3)
})