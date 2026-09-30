import { z} from "zod"


export const messageSchema = z.object({
    content: z.
    string()
    .min(5,{message:"message should be atleast 5 char"})
    .max(200,{message:"message must be atmost 200 charcter"}),

    // username: z.
    // string()
    // .min(3,{message:"username should be altLeast 3 character "})
    // .max(30,{message:"usename should be atMost 30 character"})
    

})