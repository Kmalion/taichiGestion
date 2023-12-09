import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB  from "@/utils/db"
import User from "../../../../models/User"
import bcrypt from "bcryptjs"

const handler = NextAuth({
 providers:[
    CredentialsProvider({
        name: 'credentials',
        credentials: {
            email: { label: "Email", type: "email", placeholder: "email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req){
            await connectDB()

            const userFound = await User.findOne({email: credentials?.email})
            if(!userFound) throw new Error ("El email o la contraseña no son válidas")

            const passwordMAtch = await bcrypt.compare(credentials?.password, userFound.password)
            if(!passwordMAtch) throw new Error("El email o la contraseña no son válidas")


             return userFound
          }
    })
 ],
 callbacks:{
    jwt( {account, token, user, profile, session}){
        if(user) token.user = user
        return token

    },
    session({ session, token}){
        session.user = token.user
        return session
    }
 }  ,
 pages: {
    signOut: '/api/auth/signout', 
    signIn: '/login'
  },
})

export { handler as GET, handler as POST }