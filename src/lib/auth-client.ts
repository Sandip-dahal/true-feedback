import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
    baseURL:"http://localhost:3000",
    plugins:[
        emailOTPClient(),
    ]
})



export { authClient}