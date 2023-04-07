import { prisma } from "./database.server";
import { hash, compare } from "bcryptjs"
import { ErrorType } from "./types.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";


type AuthProps = {
    email: string
    password: string
} 

const SESSION_SECRET= process.env.SESSION_SECRET!

const sessionStorage = createCookieSessionStorage({
    cookie: {
        secure: process.env.NODE === "production",
        secrets: [SESSION_SECRET],
        sameSite: "lax",
        maxAge: 30*24*60*60,
        httpOnly: true
    }
})

async function createUserSession (userId: string, redirectPath:string) {
    const session = await sessionStorage.getSession()
    session.set("userId", userId)
    return redirect(redirectPath, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    })
}

export async function getUserFromSession (request: Request) {
   const session = await sessionStorage.getSession(request.headers.get("Cookie"))
  
   const userId = session.get("userId")

   if(!userId) {
    return null
   }

   return userId
}

export async function destroyUserSession (request: Request) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"))

    return redirect("/", {headers: {
        "Set-Cookie": await  sessionStorage.destroySession(session)
    }})
}

export async function requireUserSession (request: Request) {
   const userId =  await getUserFromSession(request)

   if(!userId) {
    throw redirect("/auth?mode=login")
   }

   return userId
} 

export async function signup ({email, password}: AuthProps) {
   
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if(existingUser) {
        const error: ErrorType = new Error("A user with the provided email address exists already")
        error.status = 422
        throw error
    }

    const passwordHash = await hash(password, 12)

   const user = await prisma.user.create({data: {email, password: passwordHash}})

    return createUserSession(user.id, "/expenses")
}

export async function login ({email, password}: AuthProps) {
    const existingUser = await prisma.user.findFirst({ where: { email } });

    if(!existingUser) {
        const error: ErrorType = new Error("This email doesn't exist")
        error.status = 401
        throw error
    }

    const passwordCorrect = await compare(password, existingUser.password)

    if(!passwordCorrect) {
        const error: ErrorType = new Error("Incorrect password")
        error.status = 401
        throw error
    }

    return createUserSession(existingUser.id, '/expenses');
}

