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
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import axios from "axios"
import type { Message} from "@/model/Message"
import { toast } from "./ui/toast"

type MessageCardProps = {
  message : Message,
  onMessageDelete: (messageId: string)=>void

}

function MessageCard({message,onMessageDelete}:MessageCardProps) {

    const handleDelete = async () => {
        const response = await axios.delete(`/api/delete-message/${message.id}`)
        toast.add({
            title: response.data.message
        })
        
    }
  return (
<Card>
  <CardHeader>
    <CardTitle>{message.content}</CardTitle>
    <CardDescription>{new Date(message.created_at).toLocaleDateString()}</CardDescription>
    <AlertDialog>
  <AlertDialogTrigger render={<Button variant="outline"><X className="w-5 h-5" /></Button>} >
    Show Dialog
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your message
        from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  </CardHeader>
  
</Card>


   
  )
}

export default MessageCard