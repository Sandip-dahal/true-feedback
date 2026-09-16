"use client";

import { useRouter} from "next/navigation"
import { authClient } from "@/lib/auth-client"


const Logout = () =>{
    const router = useRouter()


    const handleLogout = async() =>{
        const {error} = await authClient.signOut()

        if(error){
            console.error("Logout Failed:",error.message)
            return
        }
        router.push("/signup")
        router.refresh()
    }




    return(
        <button 
        type="button"
        onClick={handleLogout}
        >
            Logout
        </button>
    )
}

export { Logout}