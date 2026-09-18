"use client"

import { useRouter } from "next/navigation";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";




type VerifuOtpFromProps = {
    email: string,
}


const VerifyOtpForm = ({email}:VerifuOtpFromProps) =>{

    const router = useRouter()
    
    const [otp,setOtp] = useState("")
    const [error,setError] = useState("")
    const [ isSubmitting,setIsSubmitting] = useState(false)
    const [isResending, setIsREsending] = useState(false)


    const VerifyOtp = async() =>{
        setError("");

        if(!/^\d{6}$/.test(otp)){
            setError("please Enter a valid 6-digit otp")
            return
        }
        setIsSubmitting(true)
        try {
            const { error} = await authClient.emailOtp.verifyEmail({
                email,
                otp
            })
            if(error){
                setError(error.message ||"Invalid or expird otp")
                return
            }
            router.push("/signin")
            router.refresh()
            
        } catch (error) {
            setError("someThing Went Wrong.Please try again")
            
        }
        finally{
            setIsSubmitting(false)
        }

    };

    const ResendOtp = async()=>{
        setError("")
        setIsREsending(true)

        try {
            const { error} = await authClient.emailOtp.sendVerificationOtp({
                email,
                type:"email-verification"
            })
            if(error){
                setError(error.code ||"Unable to resend OTP")
                return

            }
        } catch (err) {
            setError("Something went worng while resending the otp")   
        }
        finally{
            setIsREsending(false)
        }
    }
    
    return(
        <div>
            <h1>Verify your email</h1>

            <p>we sent a verification code to:</p>
            <p>{email}</p>

            <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter 6-digit code"
            maxLength={6}
            value={otp}
            onChange={(e) => {
                const value = e.target.value

                if(/^\d*$/.test(value)){
                    setOtp(value)
                }
            }}

            />
            {error && (
                <p>{error}</p>
            )}

            <button 
            type="button"
            onClick={VerifyOtp}
            disabled={isSubmitting || otp.length !==6}
            >
                {isSubmitting ? "Verifying...":"verify email"}
            </button>

            <button 
            type="button"
            onClick={ResendOtp}
            disabled={isResending}
            >
                {isResending ? "Sending...":"Resend OTP"}
            </button>
        </div>
    )
}
export {VerifyOtpForm}

