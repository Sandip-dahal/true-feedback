import React from 'react'
import { auth} from "@/lib/auth"
import {db} from "@/database/db"
import {message} from "@/model/Message"
import { eq } from "drizzle-orm"


export async function DELETE(request: Request){

    const {searchParams} = new URL(request.url)
    const messageId = searchParams.get("messageId")

    if(!messageId){
        return Response.json({
            success: false,
            message: "Message ID is required"
        })


    }


    try{

        const session = await auth.api.getSession(
           { headers: request.headers}
        )
        if(!session || !session?.user){
            return Response.json({
                success:false,
                message:"NOT AUTHORIZED"
            },
            {status:401}
        )

        }

        await db.delete(message).where(eq(message.id,messageId))

        return Response.json({
            success:true,
            message: "Feedback is deleted"
        },
        {
            status:200
        }
        )



    }catch(error){
        console.error("Internal server Errors :", error)
        return Response.json({
            success: false,
            messgae: "Internal server error"
        })


}
}