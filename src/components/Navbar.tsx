"use client"

import { authClient } from '@/lib/auth-client'
import { Button } from '@base-ui/react'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'



function Navbar() {

    const router = useRouter()
    const [isLogout, setIsLogout] = useState(false)

    

    const {data: session} =  authClient.useSession()

    const user = session?.user

    const handleSignOut =async() =>{
        setIsLogout(true)
        try {
            const { error} = await authClient.signOut()
    
            if(error){
                console.error("Error Will Logout: ", error)
            }
            router.push("/signin")
            router.refresh()
        } catch (error) {
            console.error("Internal server Error while Logout :", error)

            
        } finally {
            setIsLogout(false)
        }
    }

  return (
    <nav className='p-4 md:p-6 shadow-md bg-gray-800 text-white'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a href='#' className='text-xl font-bold mb-4 md:mb-0'>
                True Feedback
            </a>
            { session ? (
                <>
                <span className='mr-4'>
                    Welcome, {user?.username || user?.email}
                </span>
                
                <Link href="/signin">
                <Button 
                disabled={isLogout}
                onClick={ handleSignOut} 
                className="w-fit bg-slate-100 text-black shadow-xl hover:bg-gray-600 hover:text-white border-black rounded-md p-0.5"
                > 
                {isLogout ? (
                    <Loader className='animate-spin'/>
                ):("Logout")} 
                      
                </Button>
                </Link>
                
                </>
            ):(
                    
                    <Button className="w-full md:w-auto bg-slate-100 text-black"> 
                        Login
                    </Button>
                    
                
            )}

        </div>
    </nav>
  )
}

export default Navbar