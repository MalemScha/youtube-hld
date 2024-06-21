import React from 'react'
import { useSession, signOut } from "next-auth/react"
import { useMenuStore } from '../zustand/menuActiveStore'
import { useRouter } from 'next/navigation'

const sidebar = ({ tab }) => {
    const router = useRouter()
    const { menuActive } = useMenuStore()
    const { data } = useSession()
    const logout = () => signOut()

    const goToUpload = () => {
        router.push('/upload')
    }

    const goToHome = () => {
        router.push('/')
    }

  return (
    <div className='bg-gray-800 flex flex-col p-3 px-4 pb-6'>
        <div onClick={goToHome} className={`flex ${menuActive && tab === "home"  ? 'flex-row gap-x-3' : 'flex-col'} items-center py-4 cursor-pointer text-white hover:text-blue-400`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <p className={`${menuActive && tab === "home" ? 'text-sm' : 'text-xs'} font-medium pt-1`}>Home</p>
        </div>
        <div onClick={goToUpload} className={`flex ${menuActive && tab === "home" ? 'flex-row gap-x-3' : 'flex-col'} items-center py-4 cursor-pointer text-white hover:text-blue-400`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <p className={`${menuActive && tab === "home" ? 'text-sm' : 'text-xs'} font-medium pt-1`}>Upload</p>
        </div>
        <div className={`flex ${menuActive && tab === "home" ? 'flex-row gap-x-3' : 'flex-col'} items-center py-4 cursor-pointer text-white hover:text-blue-400`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            <p className={`${menuActive && tab === "home" ? 'text-sm' : 'text-xs'} font-medium pt-1`}>Playlist</p>
        </div>
        <div className={`flex ${menuActive && tab === "home" ? 'flex-row gap-x-3' : 'flex-col'} items-center py-4 cursor-pointer text-white hover:text-blue-400`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <p className={`${menuActive && tab === "home" ? 'text-sm' : 'text-xs'} font-medium pt-1`}>You</p>
        </div>
        { data ? <div onClick={logout} className={`flex ${menuActive && tab === "home" ? 'flex-row gap-x-3' : 'flex-col'} items-center py-4 cursor-pointer text-white hover:text-blue-400`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <p className={`${menuActive && tab === "home" ? 'text-sm' : 'text-xs'} font-medium pt-1`}>Logout</p> 
        </div> : null }
    </div>
  )
}

export default sidebar