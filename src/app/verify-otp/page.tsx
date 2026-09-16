import { VerifyOtpForm } from "./Verifyotp-form"

type verifyOtpPageProps = {
    searchParams:Promise<{
        email?:string;
    }>
}

const verifyOtpPage = async({searchParams,}:verifyOtpPageProps) =>{
    
    const params = await searchParams;

  return (
    <div>
        <VerifyOtpForm  email={params.email ?? ""} />
    </div>
  )
}

export default verifyOtpPage