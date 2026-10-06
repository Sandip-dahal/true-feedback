import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";


const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL! ,
    plugins:[
        emailOTPClient(),
        inferAdditionalFields<typeof auth>(),
    ]
})



export { authClient}