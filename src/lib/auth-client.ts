import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";


const authClient = createAuthClient({
    baseURL:"http://localhost:3000",
    plugins:[
        emailOTPClient(),
        inferAdditionalFields<typeof auth>(),
    ]
})



export { authClient}