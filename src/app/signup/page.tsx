"use client"

import { Controller, useForm, useWatch} from "react-hook-form"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { signUpValidation } from "@/schemas/SignUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useEffect, useState } from "react"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { Field, FieldLabel,FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "@/components/ui/toast"



type SignUpFormData = {
    name:string,
    username: string,
    email: string,
    password: string,
}



const  SignupForm = () =>{

    const router = useRouter()

    const [ isCheckingUSername, setIsCheckingUsername] = useState(false)
    const [ isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error , setError] = useState("")


    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver: zodResolver(signUpValidation),
        defaultValues:{
            username:"",
            name:"",
            email:"",
            password:"",

        }
    })

    const username = useWatch({
        control: form.control,
        name: "username"
    })


    useEffect(() =>{
        const trimUsername = username?.trim()?? ""

        if(!trimUsername){
            setIsCheckingUsername(false)
            setIsUsernameAvailable(null)
            return

        }

        const controller = new AbortController()

        const timer = setTimeout( async () =>{
            try {
                console.log("USERNAME CHECKING .....")
                setIsCheckingUsername(true)

                const response = await axios.get(`/api/check-username`,
                    {
                        params:{
                            username: trimUsername
                        },
                        signal:controller.signal,
                    }
                )

                setIsUsernameAvailable(response.data.success)
                toast.add({
                    title:"Success",
                    description: response.data.message
                })
            } catch (error) {
                //request was cancelled because username changed
                if(axios.isCancel(error)){
                    return
                }

                console.error("USername Availability check Failed:", error)
                setIsUsernameAvailable(false)
                
            }finally{
                setIsCheckingUsername(false)
            }
        },400)

        return() =>{
            clearTimeout(timer)
            controller.abort()
        }


    },[username]) 

    const onSubmit = async(data:SignUpFormData) =>{


        try {
            setIsSubmitting(true)
            const { error} = await authClient.signUp.email({
                username:data.username,
                name : data.name,
                email: data.email,
                password : data.password,
            })
    
            if(error) {
                setError("Unable to create Account")
                return
                
            }
    
            const { error: otpError} = await authClient.emailOtp.sendVerificationOtp({
                email:data.email,
                type: "email-verification"
    
            })
    
            if(otpError){
                setError("Account Created but we couldnt send the verification OTP")
                toast.add({
                    title:"Failed",
                    description:"Failed to send OTP"
                })
                return
            }
            toast.add({
                title:"Sucess",
                description:`OTP is sent to ${data.email}`
            })
            //Go to verification page.... where you enter the otp
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`)
            router.refresh()
        } catch (error) {
            console.error("Internal server error while sign up :", error)
            
        } finally{
            setIsSubmitting(false)
        }

    }

const handleGoogleSignUp = async () =>{
    const { error} = await authClient.signIn.social({
        provider:"google",
        callbackURL:"/signin"
    })

    if(error){
        console.error("Failed to signUp", error.code)
        return
    }
    //router.push("/dashboard")
}


    




    return(
        <div 
        className="flex justify-center items-center min-h-screen bg-gray-200">
            <div
            className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
                <div 
                className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message

                    </h1>
                    <p className="mb-4">
                        Sign Up to start your anonymous adventure
                    </p>

                </div>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Controller 
                    name="username"
                    control={form.control}
                    render={({field,fieldState}) =>(
                        <Field  data-invalid={ fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Username
                            </FieldLabel>

                            <Input 
                            {...field}
                            id={field.name}
                            type="text"
                            required
                            placeholder="Enter your unique username"
                            aria-invalid={fieldState.invalid}
                            />

                            {fieldState.invalid && 
                            <FieldError errors ={[fieldState.error]} />
                            }

                        </Field>

                    )}
                    />
                    {isCheckingUSername ?(
                        <p className="text-gray-500">Checking username....</p>
                    ): isUsernameAvailable === true ?(
                        <p className="text-green-600">Username is available</p>
                    ): isUsernameAvailable === false ?(
                            <p className="text-red-600">Username Already taken</p>
                    ): null}

                    <Controller 
                    name="name"
                    control={form.control}
                    render={({field,fieldState}) =>(
                        <Field data-invalid = {fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Name
                            </FieldLabel>

                            <Input
                            { ...field}
                            id={field.name}
                            type="text"
                            required
                            placeholder="Enter your name"
                            aria-invalid={fieldState.invalid}
                            />

                            { fieldState.invalid &&
                            <FieldError errors ={[fieldState.error]} />
                            }
                        </Field>
                    )}
                    />

                    <Controller 
                    name="email"
                    control={form.control}
                    render={({field,fieldState}) =>(
                        <Field data-invalid = {fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Email
                            </FieldLabel>

                            <Input
                            { ...field}
                            id={field.name}
                            type="email"
                            required
                            placeholder="you@example.com"
                            aria-invalid={fieldState.invalid}
                            />

                            { fieldState.invalid &&
                            <FieldError errors ={[fieldState.error]} />
                            }
                        </Field>
                    )}
                    />

                    <Controller 
                    name="password"
                    control={form.control}
                    render={({field,fieldState}) =>(
                        <Field data-invalid = {fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Password
                            </FieldLabel>

                            <Input
                            { ...field}
                            id={field.name}
                            type="password"
                            required
                            placeholder="Enter you password"
                            aria-invalid={fieldState.invalid}
                            />

                            { fieldState.invalid &&
                            <FieldError errors ={[fieldState.error]} />
                            }
                        </Field>
                    )}
                    />
                    {error && (
                        <p className="text-red-600">{error}</p>
                    )}
                    
                    <div className="flex gap-8 mt-5">
                    <Button
                    type="submit"
                    className="flex-1"
                    disabled={ isSubmitting}
                    >
                       {isSubmitting ? (
                       <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin"  />
                       Creating Account...
                       </>):("Sign Up")
                        } 
                    </Button>
                    
                    <Button
                    type="button"
                    className="flex-1"
                    onClick={handleGoogleSignUp}
                    >
                        Sign Up With Google
                    </Button>
                    </div>
                    
                  

                    <div className="text-center mt-2">
                        <p>
                            Already a member?{""}
                            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
                                Sign In
                            </Link>
                        </p>
                    </div>
                    </form>

                </CardContent>
            </div>
        </div>
        
    )
}

export default SignupForm;
