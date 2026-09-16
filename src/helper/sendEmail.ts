import { resend} from "@/lib/resend"


type sendOtpParams = {
    email:string,
    otp:string,
    type: |"sign-in" |"email-verification" |"forget-password" |"change-email",
}
const sendOtpEmail = async({email,otp,type}:sendOtpParams) =>{
    let subject:string;
    switch(type){
        case "email-verification":
            subject="verify your true Feedback account";
            break;

        case "sign-in":
            subject="Your true Feedback sign-in code";
            break;

        case "forget-password":
            subject="Reset Your true Feedback Password";
            break;

        case "change-email":
            subject="Verify your new email"
            break;

    }

    try {
        const{ error} = await resend.emails.send({
            to:email,
            from:process.env.FROM_EMAIL || "onboarding@resend.dev",
            subject,
            html:`
                <div style="front-family:sans-serif; max-width:500px; margin:0 auto;">
                <p> Enter this code to verify yourself</p>
                <h1> ${otp} </h1>
                <p style="font-size:14px; color:#666"> This code expires in 3 minutes </p>
                </div>`
        })
    
        if(error){
            console.error("Resend Error:",error);
            return;
        }
        console.log("OTP email is sent Successfully")
    } catch (err) {
        console.error("Failed to send OTP email",err)
        
    }

}

export { sendOtpEmail}