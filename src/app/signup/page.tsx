"use client"

import { useForm} from "react-hook-form"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

type SignUpFormData = {
    name:string,
    email: string,
    password: string,
}


const  SignupForm = () =>{

    const router = useRouter()

   const { 
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState:{errors, isSubmitting , isSubmitSuccessful}

} = useForm<SignUpFormData>({
    mode:"onChange",
})

const submitForm = async(data:SignUpFormData) =>{
    clearErrors()
    const { name,email,password} = data

    const{ error} = await authClient.signUp.email({
        name:name.trim(),
        email:email.trim(),
        password: password,
    })

    if(error){
        setError("root",{
            message: error.message || "Unable to create acccount"
        })
        return
    }

    await authClient.emailOtp.sendVerificationOtp({
            email,
            type:"email-verification"
        })
    

    router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
    console.log("OTP sent successfully")


}

const handleGoogleSignUp = async () =>{
    const { error} = await authClient.signIn.social({
        provider:"google",
        callbackURL:"/dashboard"
    })

    if(error){
        console.error("Failed to signUp", error.code)
        return
    }
    //router.push("/dashboard")
}


    




    return(
        <form onSubmit={handleSubmit(submitForm)}>
            <div>
                <label>username</label>
                <input 
                type="text"
                placeholder="Enter your name"
                {...register("name",{
                    required:"Username is Requuired",
                    maxLength:{
                        value:30,
                        message:"Username must be atMost 30 character",
                    }
                })}
                />
                {errors.name && 
                <p>{errors.name.message}</p>
                }

                <label>Email</label>
                <input
                type="email"
                placeholder="Enter Your Email"
                {...register("email",{
                    required:"Email is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message:"Invalid email addresh"
                    },
                })} 
                />
                {errors.email &&
                <p>{errors.email.message}</p>
                }


                <label>password</label>
                <input
                type="password"
                placeholder="Enter your password"
                className="text-black"
                {...register("password",{
                    required:"Password is Required",
                    minLength:{
                        value:8,
                        message:"Password must be at least 8 character"
                    }
                
                })}
                
                />
                {errors.password &&
                <p>{errors.password.message}</p>
                }

                <div className="flex justify-center text-center gap-5 ">
                <button
                type="submit"
                className="border border-color-red"
                disabled={isSubmitting}
                >
                   {isSubmitting ? "submitting...":"signUp"}
                </button>

                <button 
                type="button"
                className="border-3 border-color-red rounded hover:bg-red-700 hover:border-blue-800 transition-all"
                onClick={handleGoogleSignUp}
                >
                    signUp with Google
                </button>
                </div>

            </div>

        </form>
    )
}

export default SignupForm
