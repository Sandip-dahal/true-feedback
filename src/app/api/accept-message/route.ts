import { db } from "@/database/db";
import { auth } from "@/lib/auth";
import {user} from "@/model/User"
import {  z } from "zod";
import { acceptingMeassageValidation} from "@/schemas/AcceptingMessageSchema"
import { eq } from "drizzle-orm";
import { headers } from "next/headers";


const acceptMessageSchema = acceptingMeassageValidation

export async function POST(request:Request) {

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
    
        if(!session?.user){
            return Response.json(
                {
                    success:true,
                    message:"Unauthorized"
                },
                {
                    status:401
                }
            )
        }
    
    // Reads the data comming form the body ......
        const body = await request.json()
    
    //validate the data the reads earlier....user zod schema created above
        const result = acceptMessageSchema.safeParse(body)
    
        if(!result.success){
            return Response.json(
                {
                    success:false,
                    message:"Invalid message Setting",
                    errors: result.error.flatten().fieldErrors,
                },
                {status:400}
            )
        }
    
        const {isAcceptingMessage } = result.data
    
        const [ updatedUser] = await db
        .update(user)
        .set({
            isAcceptingMessage:isAcceptingMessage
        })
        .where(eq(user.id,session.user.id))
        .returning({
            id:user.id,
            isAcceptingMessage:user.isAcceptingMessage
        })
    
        if(!updatedUser){
            return Response.json(
                {
                    success:false,
                    message:"User not found "
                },
                { status:404}
            )
        }
    
        return Response.json(
            {
                success:true,
                message:isAcceptingMessage? "You are now accepting message": "You are no longer Accepting Message",
                data:{
                    isAcceptingMessage:updatedUser.isAcceptingMessage
                }
            },
            {status:200}
        )
    } catch (error) {
        console.error("Failed to update message setting:", error)

        return Response.json(
            {
                success:false,
                message:"Something went worng, Internal error in message setting"
            },
            { status:500}
        )
        
    }



    
}
