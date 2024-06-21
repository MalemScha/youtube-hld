"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

const Auth = () => {
   const { data } = useSession()
   console.log('session data : ', data);

   const signin = () => {
        console.log("Signing in Google");
        signIn("google");
    }

    const signout = () => {
        console.log("Signing out of Google");
        signOut();
    }

  return (
    <div className='m-10'>
        <button onClick={signin} type="submit" className="text-white bg-red-700 hover:bg-red-800  font-medium rounded-full  px-5 py-2.5 text-center me-2 mb-2">Sign In with Google</button>
        <button onClick={signout} type="submit" className="text-white bg-blue-600 hover:bg-blue-700  font-medium rounded-full  px-5 py-2.5 text-center me-2 mb-2">Sign Out</button>
    </div>
  )
}

export default Auth