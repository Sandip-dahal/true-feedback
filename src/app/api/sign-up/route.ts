import { auth} from  "@/lib/auth"
import { db } from "@/database/db"
import { user } from "@/model/User"
import { NextRequest } from "next/server"


const POST= async(request:NextRequest) =>{

    try {
 

        
    } catch (error) {
        console.error("error registring user:", error)

        return Response.json(
            {
                success:false,
                message:"Error registing user"
            },
            {status:500},
        )
        
    }
}