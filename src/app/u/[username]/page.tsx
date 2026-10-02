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
import  {aiSuggestionSchema}  from "@/schemas/AiSuggestionSchema"
import { Separator } from '@/components/ui/separator'


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
  const [suggestMessages, setSuggestMessage] = useState([])
  const [ isSuggestMessageLoading, setIsSuggestMessageLoading] = useState(false)
  


  const defaultSuggestMessages = ["Good","Bad","Modrate"]

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

  const aiForm = useForm<z.infer<typeof aiSuggestionSchema>>({
    resolver: zodResolver(aiSuggestionSchema),
    defaultValues:{
      topic:"",
      tone: "friendly"
    }
  })

const handleMessage = async(data: z.infer<typeof aiSuggestionSchema>) =>{
  const {topic,tone} = data
   await fetchAiMessage({
    topic,
    tone
  })
}
const fetchAiMessage = async({topic,tone}: z.infer<typeof aiSuggestionSchema>) =>{  
  setIsSuggestMessageLoading(true)
    try {
      const response = await axios.post(`/api/suggest-message`,{
        tone,
        topic
      })

      if(!response || !response.data){
        console.error("Failed to fetch suggestion message")
        toast.add({
          title: response.data.message
        })

      }

      setSuggestMessage(response.data.data.suggestion)
      toast.add({
        title:"Message Appears"
      })

    } catch (error) {
      console.error("Internal server error While fetching the data", error)
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title: "ERROR",
        description: axiosError.response?.data.message
      })
      
    } finally{
      setIsSuggestMessageLoading(false)
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
          // (errors) =>{
          //   console.log("VALIDATION ERRORS :", errors)
          // }
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

      <div className='space-y-4 my-8 border-dotted'>
      <form onSubmit= {aiForm.handleSubmit(handleMessage)}>
        <label>TOPIC:</label>
        <input 
        type='text'
        placeholder='enter your topic'
        className='border'
        {...aiForm.register("topic")}
        />
        {aiForm.formState.errors.topic && (
          <p  className='text-red-900'>{aiForm.formState.errors.topic.message}</p>
        )}

        <label>TONE:</label>
        <select
        {...aiForm.register("tone")}
        className='border'>
          <option value="friendly">friendly</option>
          <option value="casual">casual</option>
          <option value="constructive">constructive</option>
          <option value="honest">honest</option>
        </select>

        <Button
        type='submit'
        className="my-4"
        disabled={isSuggestMessageLoading}
        >
          {isSuggestMessageLoading ? (
            <Loader2 />
          ):("suggest message")}
        </Button>
        <h3 className='text-2xl font-bold italic'>Messages</h3>
        <Separator className="my-3" />

        <div className='flex flex-col justify-center my-6'> 
          {suggestMessages.length >0 ? (
            suggestMessages.map((item,index) =>(
              <Button 
              key={index}
              onClick={() => handleMessageClick(item)}
              className=' w-full h-auto min-h-10 justify-center whitespace-normal rounded-lg border border-gray-200 bg-white px-4 py-3 my-2 text-center text-sm font-normal leading-relaxed text-gray-800 shadow-lg transition-all duration-200 hover:border-green-900 hover:bg-gray-600 hover:shadow-2xl active:scale-[0.99] hover:text-white'
              >
                {item}
              </Button>
            ))
          ):(defaultSuggestMessages)}
          </div>
        

          


      </form>
      </div>

    </div>
  )
}

export default page