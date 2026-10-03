
"use client"
import { authClient } from '@/lib/auth-client'
import type { Message } from '@/model/Message'
import { acceptingMeassageValidation } from '@/schemas/AcceptingMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'

import { useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'


import   MessageCard from "@/components/MessageCard"
import { toast } from '@/components/ui/toast'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator' 
import { Switch } from '@/components/ui/switch'
import { RefreshCcw } from "lucide-react"
import LoadingSkeleton from '@/helper/Loading'



function ClientDashboard() {

  const [messages, setMessages] = useState<Message []>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  //optimistic ui for delete....
  const handleDeleteMessage = async(messageId: string) =>{

  //holding the message to be deleted so can be restore if dlt fails
    const deleteMessageIndex = messages.findIndex((message) => message.id !== messageId)
    const deleteMessage = messages[deleteMessageIndex]
    if(!deleteMessage) return



// Optimistic UI dlt.......
    setMessages((prevMessages) => prevMessages.filter((message) => message.id !== messageId))



// Actual delete the message from db.........
    try {
      const response = await axios.delete(`/api/delete-message`,{
        params:{
          messageId,
        }
      })
  
      toast.add({
        title:"Feedback is deleted"
      })
    } catch (error) {

      // Api fails --> Restore
      setMessages((prevMessages) => {

        const restoredMessage = [...prevMessages]
        restoredMessage.splice(deleteMessageIndex,0,deleteMessage)
        return restoredMessage
      })
          

      toast.add({
        title: "Failed to delete Message"
      })
      
    }
  }

  const { data: session } = authClient.useSession()

  const form = useForm({
    resolver: zodResolver(acceptingMeassageValidation),
     defaultValues:{
      isAcceptingMessages:true
    }
  })
  const {
    register,
    setValue,
    watch
  } = form

  const isAcceptingMessages = watch("isAcceptingMessages")

  const fetchAcceptMessage = useCallback( async( ) =>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-message`)

      if(response.data.isAcceptingMessages !== undefined){
        setValue("isAcceptingMessages",response.data.isAcceptingMessages)

      }
      

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title: "Error",
        description : axiosError.response?.data.message || "Failed to fetch message status"
      }) 
    }finally{
      setIsSwitchLoading(false)
    }

  }, [setValue])

  const fetchMessages = useCallback( async (refresh:boolean =false) =>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>(`/api/get-message`)
      //console.log("Response Data:", response.data)
      //console.log("Messages:", response.data?.messages)
      setMessages(response.data?.messages || [])

      if(refresh){
        toast.add({
          title:"Refreshed Messages",
          description: "Showing Lastest messages "

        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to Fetch Feedback Message",
      })
      
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }


  }, [setIsLoading,setMessages]) 

  useEffect(() =>{
    if(!session || !session?.user) return
    fetchMessages()
    fetchAcceptMessage()

  }, [session,setValue,fetchAcceptMessage,fetchMessages])

  //handle switch change..
  const handleSwitchChange = async() =>{
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-message`,
        {
          isAcceptingMessages: !isAcceptingMessages
        }
      )

      setValue("isAcceptingMessages", !isAcceptingMessages)
      toast.add({
        title: response.data.message

      })


    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to fetch Message setting"
      })
      
    }
  }

  const username = session?.user.username

  const baseUrl = typeof window !== "undefined" ?`${window.location.protocol}//${window.location.host}`:""
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () =>{
    navigator.clipboard.writeText(profileUrl)
    toast.add({
      title: "URL copied",
      description:"Profile URL has been copied to clipboard"
    })
  }

  if(!session || !session.user){
    return <div> Please Login</div>
  }


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="border border-2 border-gray-300 w-full p-1 mr-2 rounded-lg"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('isAcceptingMessages')}
          checked={isAcceptingMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {isAcceptingMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({length:6}).map((_,index) =>(
            <LoadingSkeleton  key={index}/>
          ))
          

          
        ):(
        
        messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message.id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )
        )}
      </div>
    </div>
  )
}

export default ClientDashboard
