"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";


const SignIn = () =>{
    const router = useRouter()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState("")



    const handleSignIn = async() =>{

        const { error} = await authClient.signIn.email({
            email:email,
            password:password
        })

        if(error){
            setError("Failed to sign In..")
        }
        router.push("/dashboard")
        router.refresh()



    }





    return(
        <div className="flex justify-enter text center">
            <label>Email:</label>
            <input 
            type="email"
            placeholder="enter Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />


            <label>Password:</label>
            <input
            type="password"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button
            type="button"
            onClick={handleSignIn}
            >
                SignIn
            </button>
            {error && (
                <p className="text-red-900">{error}</p>
            )}


        </div>
    )
}

export default SignIn



