import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/db";
import * as schema from "@/model/User"
import { emailOTP } from "better-auth/plugins";
import { sendOtpEmail } from "@/helper/sendEmail";

 export const auth = betterAuth({
    database: drizzleAdapter(db,{
        provider:"pg",
        schema,
    }),

    emailAndPassword:{
        enabled:true,
        requireEmailVerification:true,
        autoSignIn:false,

    },
    socialProviders:{
        google:{
            clientId:process.env.GOOGLE_CLIENT_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
        }
    },
    user:{
        additionalFields:{
            username:{
                type:"string",
                required:true,
            }
        },
        isAcceptingMessage:{
            type:"boolean",
            required:false,
            defaultValue: true,
        }
    },
    session:{
        expiresIn:60*60*24,
        updateAge:60*60,

    },
    plugins:[
        emailOTP({
            overrideDefaultEmailVerification:true,
            otpLength:6,
            expiresIn:60*3,
            allowedAttempts:3,
            sendVerificationOnSignUp: true,

            async sendVerificationOTP({email, otp,type}) {
                await sendOtpEmail({email,otp,type})
                
            },
        })
    ],
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURl: process.env.BETTER_AUTH_URL!,
})