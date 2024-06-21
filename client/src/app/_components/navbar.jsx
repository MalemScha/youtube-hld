"use client"
import React, { useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import SearchBar from './searchbar'
import { useMenuStore } from '../zustand/menuActiveStore'

const NavBar = () => {
   const router = useRouter()
   const { data } = useSession()
   const { toggleMenu } = useMenuStore()
   const [showProfile, toggleShowProfile] = useState(false)

   const loginHandler = () => {
        signIn("google");
    }

   const logout = () => signOut()

   console.log('data---------- ', data);

   const goToUpload = () => {
       router.push('/upload')
   }

   const goToHome = () => {
    router.push('/')
   }

   return (
       <div>
           <nav className="border-gray-200 bg-gray-900">
               <div className="w-full flex flex-wrap items-center justify-between items-center p-3 px-4">
                    <div className='flex'>
                        <button onClick={toggleMenu} data-collapse-toggle="navbar-hamburger" type="button" className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm rounded-lg hover:bg-gray-100 focus:outline-none text-gray-400 hover:bg-gray-700" aria-controls="navbar-hamburger" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                            </svg>
                        </button>
                        <span onClick={goToHome} className="self-center text-xl font-semibold whitespace-nowrap text-white ml-1.5 cursor-pointer">YouTube</span>
                    </div>
                   <SearchBar />
                   <div className=" w-full md:block md:w-auto pr-3" id="navbar-default">
                        { data ? <div className='flex gap-6 justify-center items-center'>
                                    
                            <a onClick={goToUpload} className="flex items-center space-x-2 rtl:space-x-reverse text-white mr-2 cursor-pointer hover:text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                            </a>

                            <button onClick={() => toggleShowProfile(prev => !prev)} type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                                <span className="sr-only">Open user menu</span>
                                { data.user?.image ? <img className="w-8 h-8 rounded-full" src={data?.user?.image} alt="user photo" /> : <div className="relative w-7 h-7 overflow-hidden bg-gray-200 rounded-full">
                                <svg className="absolute w-8 h-8 text-gray-400 -left-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                            </div> }
                            </button>

                            {showProfile? <div className="absolute top-11 right-4 z-50 my-4 text-base list-none divide-y divide-gray-100 rounded-lg shadow bg-gray-700 divide-gray-600" id="user-dropdown">
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-white">{data?.user?.name}</span>
                                </div>
                                <ul className="py-2" aria-labelledby="user-menu-button">
                                    <li>
                                        <a className="block px-4 py-2 text-sm  hover:bg-gray-600 text-gray-200 hover:text-white cursor-pointer">Dashboard</a>
                                    </li>
                                    <li>
                                         <a className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white cursor-pointer">Settings</a>
                                    </li>
                                    <li>
                                        <a onClick={logout} className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white cursor-pointer">Sign out</a>
                                    </li>
                                </ul>
                            </div> : null}
                        </div> : <div className='flex items-center'>
                        <button onClick={loginHandler} type="button" className="text-gray-300 hover:text-white border focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2 text-center border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-gray-800">Sign In</button>
                        </div> }
                   </div>
               </div>
           </nav>


       </div>
   )
}

export default NavBar
