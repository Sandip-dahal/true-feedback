import { message } from "@/model/Message";
import { db } from "@/database/db";
import {messageSchema } from "@/schemas/MessageSchema"
import { user } from "@/model/User";
import { eq } from "drizzle-orm";



const POST = async(request:Request) =>{

   try {
     const body = await request.json()
 
     const result = messageSchema.safeParse(body)
 
     if(!result.success){
         console.error("Failed while sending data",result.error)
         return Response.json(
             {
                 success:false,
                 message:"Failed While sending messsage"
             },
             {
                 status:401
             }
         )
     }
 
     const [receiver] = await db
     .select(
         {
             id:user.id,
             isAcceptingMessage:user.isAcceptingMessage
         })
     .from(user)
     .where(eq
         (user.username,result.data.username)
     )
     .limit(1)
 
     if(!receiver?.isAcceptingMessage){
         return Response.json(
             {
                 success:false,
                 message:"User is currently not receiving the message"
             },{
                status:403
             }
         )
     }
 
    await db
    .insert(message)
    .values({
        content:result.data.content,
        receiver_id:receiver.id
     })
 
    return Response.json(
        {
            success: true,
            message:"Feedback sent Successfully"
        },
        {
            status:201
        }
     )
   } catch (error) {
    console.error("Server failed to send Feedback",error)
    return Response.json(
        {
            success:false,
            message:"Server failed to send Feedback"
        },
        {
            status:500
        }
    )
    
   }
}

export { POST}