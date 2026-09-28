import { auth } from "@/lib/auth";
import { message } from "@/model/Message";
import { db } from "@/database/db";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";




const GET = async(request:Request) =>{

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
    
        if(!session || !session?.user) {
            return Response.json({
                success:false,
                message:"Not Authorized"
            },
            {
                status:401
            })
        }
    
        const [feedbackMessage] = await db
        .select({
            id:message.id,
            content:message.content,
            created_at:message.created_at,
        })
        .from(message)
        .where(eq(message.receiver_id,session.user.id))
        .orderBy(desc(message.created_at))
    
    
        return Response.json(
            {
                success:true,
                messages:feedbackMessage
            },
            {status:200}
        )
    } catch (error) {
        console.error("Failed to fetch message:",error)
        return Response.json(
            {
                success:false,
                message:"Failed to Fetch Messages"
            },
            {
                status:500
            }
        )
        
    }

}

export { 
    GET
}