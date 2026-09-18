"use client"
import { useState } from "react";

type dashboardClientProps = {
  name:string,
  email:string,
}


const ClientDashboard = ({name,email}:dashboardClientProps) =>{
  const [ isAcceptingMessage, setIsAcceptingMessage] = useState(true)
   

  const handleToogle = async() =>{
    try {
      
      const newValue= !isAcceptingMessage
      const res = await fetch("/api/accept-message",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          isAcceptingMessage:newValue
        })
      })
  
      const result = await res.json();
      if(!res.ok){
        console.error(result.message)
        return;
      }
  
      setIsAcceptingMessage(newValue)
      console.log(result.message)
    } catch (error) {
      console.error("Failed to change message setting", error)
      
    }

   
  }

  return(
    <div>
      <h1>welcome {name}</h1>
      <p>{email}</p>

      <button 
      type="button"
      onClick={handleToogle}
      >
        {isAcceptingMessage ? "ON": "OFF"}
      </button>
    </div>
  )
}

export default ClientDashboard