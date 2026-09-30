import {NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request:NextRequest) {
    const session = await auth.api.getSession({
        headers:request.headers
    })
    console.log("=== PROXY ===", request.nextUrl.pathname, "| session:", !!session);

    if(session && 
        (
            request.nextUrl.pathname.startsWith("/signup")||
            request.nextUrl.pathname.startsWith("/signin") ||
            request.nextUrl.pathname.startsWith("/verify-otp")
            
        ))
        {
            return Response.redirect(new URL("/dashboard",request.url))
        }

        if(!session && (request.nextUrl.pathname.startsWith("/dashboard")))
            {
            return NextResponse.redirect(new URL("/signin",request.url))
        }

        return NextResponse.next();

}
export const config = {
    matcher:[
        "/signin",
        "/signup",
        "/",
        "/dashboard/:path*",
    ]
}