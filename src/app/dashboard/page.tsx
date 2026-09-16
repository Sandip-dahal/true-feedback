import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Logout } from "@/component/Logout";
import { redirect } from "next/navigation";

const Dashboard = async() =>{

  const session = await auth.api.getSession({
    headers:await headers()
  })

  if(!session){
    console.log("not session available")
    redirect("/signin")
  }

  return(
    <div>
      <h1>Welcome {session.user.name}</h1>
      <p>{session.user.email}</p>

      <Logout />
    </div>
  )
}

export default Dashboard