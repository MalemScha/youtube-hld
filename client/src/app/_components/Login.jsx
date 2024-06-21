import React from 'react'
import { signIn } from "next-auth/react"

const Login = () => {

    const loginHandler = () => {
        signIn("google");
    }
  return (
    <div className='bg-gray-800 home-height w-screen flex justify-center items-center'>
        <div className='w-3/5 shadow p-4 flex justify-center items-center flex-col'>
            <img src="login.svg" className='py-4 w-3/5' />
            <h5 className='py-4 font-bold text-xl text-white ml-8'>Please Login to Continue</h5>
            <div className='flex justify-center items-center ml-8'>
                <button onClick={loginHandler} type="button" className="text-white font-semibold rounded-lg  px-4 py-2 me-2 mb-2 dark:bg-blue-600 hover:bg-blue-700 focus:outline-none ">Login</button>
            </div>
        </div>
    </div>
  )
}

export default Login