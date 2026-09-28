"use client"
import MessageCard from "@/components/MessageCard";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import type { Message} from "@/model/Message"
import { acceptingMeassageValidation } from "@/schemas/AcceptingMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, {  AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button} from "@/components/ui/button"
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator"; 
import { RefreshCcw } from "lucide-react";





function ClientDashboard() {

  const [messages, setMessages] = useState<Message []>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId:string) =>{
    setMessages((prevMessages) => prevMessages.filter((messages) => messages.id !== messageId))
  }

  const {data:session} = authClient.useSession()
  
  const form = useForm({
    resolver : zodResolver(acceptingMeassageValidation)
  })

  const {
    register,
    watch,setValue
  } = form;
  
  const acceptMessage = watch("acceptMessages")

  const fetchAcceptMessage = useCallback( async () =>{
    setIsSwitchLoading(true)

    try {
      const response = await axios.get("/api/accept-message")
      setValue('acceptMessages',response.data.isAcceptingMessages)
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title: "Error",
        description: axiosError.response?.data.message ||"Failed to fetch message setting",
        priority:"high"
      })
      
    } finally{
      setIsSwitchLoading(false)
    }

  }, [setValue])

  const fetchMessages = useCallback(async( refresh: boolean = false) =>{
    setIsLoading(true)
    setIsSwitchLoading(false)

    try {
      const response = await axios.get("/api/get-message")
      setMessages(response.data.messages)

      if(refresh){
        toast.add({
          title:"Refreshed",
          description:"Showing latest messages",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title:"Error",
        description: axiosError.response?.data.message
      })
      
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }


  },[setIsLoading,setMessages])

  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session,setValue,fetchAcceptMessage,fetchMessages])


  //handle switch chages 
  const handleSwitchChange = async () =>{
     
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message",{
        isAcceptingMessage : !acceptMessage
      })

      setValue("acceptMessages", !acceptMessage)
      toast.add({
        title : response.data.message
      })
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title:"Error",
        description: axiosError.response?.data?.message
      })

      
    }

  }

  const username = session?.user.username
  //todo do more research to generate url
  const baseUrl =  typeof window !=="undefined"?`${window.location.protocol}//${window.location.host}`:""
  const profileUrl = `${baseUrl}/u/${username}`

  //copy to clipboard

  const copyToClipboard= () =>{
    navigator.clipboard.writeText(profileUrl)
    toast.add({
      title:"URL Copied",
      description:"Profile URL has been copied to clipboard"
    })
  }

  if(!session || !session.user){
    return <div>Please Login</div>
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
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
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
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message.id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default ClientDashboard