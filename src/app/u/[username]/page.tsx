"use client"

import { messageSchema } from '@/schemas/MessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from "zod"
import axios, {  AxiosError } from 'axios'
import { toast } from '@/components/ui/toast'
import { ApiResponse } from '@/types/ApiResponse'
import { Field, FieldError, FieldLabel} from '@/components/ui/field'
import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { error } from 'console'


function page() {
  const params = useParams<{username:string}>()
  const username = params.username

  const form = useForm<z.infer<typeof messageSchema>>(
    {
      resolver : zodResolver(messageSchema)
    }
  )
  const messageContent = form.watch("content")

  const [isLoading, setIsLoading] = useState(false)

  const handleMessageClick = (message:string) =>{
    form.setValue("content",message)
  }

  const onSubmit = async(data:z.infer<typeof messageSchema>) =>{
    console.log("ON SUBMIT RUNNING");
    console.log("SUBMIT DATA : ",data)
    console.log("USERNAME :", username)
    setIsLoading(true)
    try {
      const response = await axios.post(`/api/send-message`,
        {
          ...data,
          username
          
  
        }
      )
  
      toast.add({
        title: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title:"Error",
        description : axiosError.response?.data.message ?? "Failed to sent Message"
      })
      
    } finally{
      setIsLoading(false)
    }


  }
  



  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link

      </h1>
      <CardContent>
        <form onSubmit={form.handleSubmit(
          onSubmit,
          (errors) =>{
            console.log("VALIDATION ERRORS :", errors)
          }
          )} className='space-y-6'>
        <Controller
        control={form.control}
        name="content"
        render={({field, fieldState}) =>(
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              Send Anonymous message to @{username}
            </FieldLabel>  

            <textarea
            placeholder='write your anonymous message here'
            className='resize-none'
            {...field}
            />
            {fieldState.invalid &&
              <FieldError errors={[fieldState.error]} />
            }
            </Field>

        )}
        />
        <div className='flex justify-center'>
          {isLoading ?(
            <Button
            disabled
            >
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              please wait
            </Button>
          ):(
            <Button 
            type='submit'
            disabled={isLoading || !messageContent}
            >
              Send It
            </Button>
          )}


        </div>

      </form>
      </CardContent>
      
    </div>
  )
}

export default page