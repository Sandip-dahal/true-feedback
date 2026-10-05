import { db } from "@/database/db";
import { userNameValidation } from "@/schemas/SignUpSchema";
import { user } from "@/model/User";
import {  z} from "zod"
import { eq, and } from "drizzle-orm";


const UsernameQuerySchema = z.object({
    username:userNameValidation
})

export async function GET(request:Request){

    try {
        const { searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get("username")
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        

        if(!result.success){
            const nameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:nameErrors?.length >0? nameErrors.join(","):"Invalid Query Parameters"
            },
            {status:400}
        )
        }
        


        const { username} = result.data
        
        console.log("Result:",result)
        const existingVerifiedUser = await db.
        select({username:user.username})
        .from(user)
        .where(
            and(
                eq(user.username,username),
                eq(user.emailVerified,true)
            )

        )
        

        if(existingVerifiedUser.length > 0){
            return Response.json(
                {
                success:false,
                message:"Username already taken"
                },
                {
                    status:200
                }
            )
        }

    return Response.json(
        {
            success:true,
            message:"Username is Available"
        },
        {
            status:200
        }
    )

    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"Error checking username"
            },
            {
                status:500
            }
        )
        
    }
}