import { z} from "zod"


export const messageSchema = z.object({
    content: z.
    string()
    .min(5,{message:"message should be atleast 5 char"})
    .max(200,{message:"message must be atmost 200 charcter"})
    

})