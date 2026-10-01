"use client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Trash2Icon, X } from "lucide-react"
import axios from "axios"
import type { Message} from "@/model/Message"
import { toast } from "./ui/toast"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
  message : Message,
  onMessageDelete: (messageId: string)=>void

}

function MessageCard({message,onMessageDelete}:MessageCardProps) {

    
    const handleDelete = async () => {

      try {
        onMessageDelete(message.id)
        
          // const response = await axios.delete<ApiResponse>(`/api/delete-message`,{
          //   params:{
          //   messageId:message.id}}
          // )
          
          // toast.add({
          //     title: response.data.message
          // })

      } catch (error) {
        console.error("Internal server error while deleting message:", error)
        toast.add({
          title:"ERROR",
          description : "Internal server error while deleting message"
        })
        
      }
        
    }
  return (
<Card>
  <CardHeader>
    <CardTitle>{message.content}</CardTitle>
    <CardDescription>{new Date(message.created_at).toLocaleDateString()}</CardDescription>
    <AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive"><X className="w-5 h-5" /></Button>} >
    Show Dialog
  </AlertDialogTrigger>
  <AlertDialogContent size="sm">
    <AlertDialogHeader>
      <AlertDialogMedia className="bg-destructive/10 text-destructive dark-bg-destructive/20 dark:text-destructive">
      <Trash2Icon />
      </AlertDialogMedia>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your message
        from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive" onClick={handleDelete}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  </CardHeader>
  
</Card>


   
  )
}

export default MessageCard