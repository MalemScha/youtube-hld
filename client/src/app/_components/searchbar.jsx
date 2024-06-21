"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useVideosStore } from '../zustand/useVideosStore'

const SearchBar
   = () => {
       const [searchText, setSearchText] = useState('');
       const { searchedVideos, updateSearchedVideos } = useVideosStore();

       const searchVideosFn = async () => {
           try {
               const res = await axios.get(process.env.NEXT_PUBLIC_API_GW_URL, { params: { q: searchText } });
               console.log('Data received - ', res.data);
               updateSearchedVideos(res.data?.map((data) => data._source))               
           } catch (error) {
               console.log("Error in searching : ", error.message)
           }
       }

       useEffect(() => {
          if(searchText && searchText?.length > 2){
            searchVideosFn()
          }
       }, [searchText])

       console.log(searchedVideos)
       return (
           <div className='w-1/3 relative'>
                <div className="flex min-w-full">
                    <div className="relative w-full">
                        <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="search" id="search-dropdown" className="block p-2 pl-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg bg-gray-700 border-0 text-white outline-none" placeholder="Search" required />
                        <button type="submit" className="absolute top-0 end-0 p-2 text-sm font-medium h-full text-white bg-gray-700 rounded-e-lg border border-2 border-gray-700 hover:bg-gray-800 bg-gray-700 hover:bg-gray-800">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>

                        <div className='absolute z-50 top-10 bg-gray-600 w-full border-0 rounded max-h-28 overflow-y-scroll'>
                            <ul>
                                {searchedVideos?.length > 1 ? searchedVideos.map((data) => (
                                <li className='py-1 px-2 text-white'>
                                    {data.title}
                                </li>
                            )) : null}
                            </ul>
                        </div>
                    </div>
                </div>
           </div>
       )
   }

export default SearchBar