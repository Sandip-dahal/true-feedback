import { db } from "@/database/db";
import { auth } from "@/lib/auth";
import {user} from "@/model/User"
import {  success, z } from "zod";
import { acceptingMeassageValidation} from "@/schemas/AcceptingMessageSchema"
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { message } from "@/model/Message";


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
    
        const {isAcceptingMessages } = result.data
    
        const [ updatedUser] = await db
        .update(user)
        .set({
            isAcceptingMessage:isAcceptingMessages
        })
        .where(eq(user.id,session.user.id))
        .returning({
            id:user.id,
            isAcceptingMessages:user.isAcceptingMessage
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
                message:isAcceptingMessages? "You are now accepting message": "You are no longer Accepting Message",
                data:{
                    isAcceptingMessages:updatedUser.isAcceptingMessages
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

export async function GET(request: Request){
    const session = await auth.api.getSession({
        headers : request.headers,
    })

    if(!session || !session?.user){
        return Response.json(
            {
                success: false,
                message:"Not Authenticated"
            },
            {status:401}
        )
    }

    try {
        //retrieve the user from the db using id
        const [availableuser] = await db
        .select({
            isAcceptingMessage:user.isAcceptingMessage
        })
        .from(user)
        .where(eq(user.id, session.user.id))

        if(!availableuser){
            return Response.json({
                success:false,
                message: "user not found"
            },
            {status:404}
         )
        }
// Return user message acceotance status....
        return Response.json(
            {
                success: true,
                isAcceptingMessage:availableuser.isAcceptingMessage ,
            },
            {status:200}
        )

    } catch (error) {
        console.error("Error retreving user:", error)

        return Response.json(
            {
                success:false,
                message: "Internal server error"
            },
            {
                status:500
            }
        )
        
    }

    

    
}
