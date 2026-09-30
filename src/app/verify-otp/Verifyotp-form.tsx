"use client"

import { useRouter } from "next/navigation";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useForm, Controller} from "react-hook-form"
import {Button} from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError} from "@/components/ui/field"
import { CardContent} from "@/components/ui/card"
import { Loader2 } from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"



type VerifuOtpFromProps = {
    email: string,
}
type verifyOtpformData = {
    otp:string,
}
const VerifyOtpForm = ({email}:VerifuOtpFromProps) =>{

    const router = useRouter()

    const [error,setError] = useState("")
    const [ isSubmitting,setIsSubmitting] = useState(false)
    const [isResending, setIsREsending] = useState(false)

    const form = useForm<verifyOtpformData>({
        defaultValues:{
            otp:""
        }
    })


    const onSubmit = async(data:verifyOtpformData) =>{
        setError("");
        setIsSubmitting(true)
        try {
            const { error} = await authClient.emailOtp.verifyEmail({
                email,
                otp : data.otp,
            })
            if(error){
                setError(error.message ||"Invalid or expird otp")
                return
            }

            const currentSession = await authClient.getSession()
            console.log("session right after OTP verify:", currentSession)
            router.push("/signin")
            router.refresh()
            
        } catch (error) {
            console.error("OTP verification failed",error)
            setError("someThing Went Wrong.Please try again")
            
        }
        finally{
            setIsSubmitting(false)
        }

    }



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
            console.error("Resend OTP Failed:",err)
            setError("Something went worng while resending the otp")   
        }
        finally{
            setIsREsending(false)
        }
    }
    
    return(
        <div
        className="flex justify-center items-center min-h-screen bg-gray-100">
            <div
            className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div
                className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Email
                    </h1>
                    <p className="mb-4">OTP is sent to {email}</p>

                </div>
                <CardContent>
                    <form id="form-rhf-verifyotp" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Controller
                        name="otp"
                        control={form.control}
                        rules={{
                            required:"OTP is Required",
                            pattern:{
                                value:/^\d{6}$/,
                                message:"OTP must be Exactly 6 digits"
                            }
                        }}
                        render={({field,fieldState}) =>(
                            <Field data-invalid={fieldState.invalid}>
                                <InputOTP 
                                id={field.name} 
                                maxLength={6} 
                                pattern={REGEXP_ONLY_DIGITS}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                disabled={isSubmitting}
                                aria-invalid={fieldState.invalid}
                                >
                                <InputOTPGroup>
                                
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                                </InputOTP>

                                

                                {fieldState.invalid && (
                                    <FieldError errors ={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                        />

                        {error && (
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        

                        <Button
                        type="submit"
                        disabled={isSubmitting || isResending|| !form.formState.isValid}
                        >
                            {isSubmitting ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"  />
                                Verifying...
                                </>
                            ):("Verify")
                            }

                        </Button>

                        <Button
                        type="button"
                        onClick={ResendOtp}
                        disabled={isSubmitting || isResending}
                        >
                            {isResending ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"  />
                                Resending...
                                </>
                            ):("Resend OTP")
                            }

                        </Button>
                        </form>
                </CardContent>



            </div>
        

        </div>
    )
}

export default VerifyOtpForm

{/* <Input
                                {...field}
                                id={field.name}
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                disabled={isSubmitting}
                                aria-invalid={fieldState.invalid}
                                /> */}
