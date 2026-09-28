import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Logout } from "@/component/Logout";
import { redirect } from "next/navigation";
import  ClientDashboard from "./ClientDashboard"




const Dashboard = async() =>{

  const session = await auth.api.getSession({
    headers:await headers()
  })
 
   console.log("DASHBOARD PAGE - session exists:", !!session)


  if(!session){
    console.log("not session available")
    redirect("/signin")
  }

   


  return(
    <div>
      <ClientDashboard 
      />

      
    </div>
  )
}

export default Dashboard