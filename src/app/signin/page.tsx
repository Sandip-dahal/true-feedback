"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod"
import { signInValidation} from "@/schemas/SignInSchema"
import * as z from "zod"
import { useState } from "react";
import { toast } from "@/components/ui/toast";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card";
import { Field,FieldLabel,FieldError } from "@/components/ui/field";
import { Link, Loader2 } from "lucide-react";

const signinPage = () =>{ 
    const router = useRouter()
    const [isSubmitting, setIsSubmmiting] = useState(false)




    const form = useForm<z.infer<typeof signInValidation>>({
        resolver: zodResolver(signInValidation),
        defaultValues:{
            email:"",
            password:"",
        }
    })

    const onsubmit = async(data: z.infer<typeof signInValidation>) =>{

        setIsSubmmiting(true)

        try {
            const {error} = await authClient.signIn.email({
                email:data.email,
                password: data.password
            })

            if(error){
            toast.add({
                title:"success",
                description: error.message,
            })
            }

            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            toast.add({
                title:"Error on signin",
                description:"Something went wrong. Please try again"
            })
            
        }
        finally{
            setIsSubmmiting(false)
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
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign In Here</p>

                </div>
                <CardContent>
                    <form id="form-rhf-signin" onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
                        <Controller
                        name="email"
                        control={form.control}
                        render={({field,fieldState}) =>(
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Email
                                </FieldLabel>

                                <Input
                                {...field}
                                id={field.name}
                                type="email"
                                placeholder="you@example.com"
                                disabled={isSubmitting}
                                aria-invalid={fieldState.invalid}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors ={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                        />

                        <Controller 
                        name="password"
                        control={form.control}
                        render={({field,fieldState}) =>(
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Password
                                </FieldLabel>

                                <Input
                                {...field}
                                id={field.name}
                                type="password"
                                placeholder="Enter youur password"
                                disabled={isSubmitting}
                                aria-invalid={fieldState.invalid}
                                />

                                {fieldState.invalid &&(
                                    <FieldError errors = {[fieldState.error]} />

                                )}

                            </Field>
                        )}

                        />

                        <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isValid}
                        >
                            {isSubmitting ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"  />
                                </>
                            ):("SignIn")
                            }

                        </Button>
                        </form>
                        <div className="text-center mt-2">
                            <p>
                                Already a member?{""}
                                <Link href="/signin" className="text-blue-600 hover:text-blue-800">
                                Sign In
                                </Link>
                            </p>
                        </div>
                </CardContent>



            </div>
        

        </div>
    )
}

export default signinPage











