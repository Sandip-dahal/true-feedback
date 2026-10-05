import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";


const authClient = createAuthClient({
    baseURL:"https://true-feedback-zkb9.vercel.app",
    plugins:[
        emailOTPClient(),
        inferAdditionalFields<typeof auth>(),
    ]
})



export { authClient}