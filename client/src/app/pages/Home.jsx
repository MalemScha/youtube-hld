"use client"
import React, { useEffect, useState } from 'react';
import axios from "axios"
import Sidebar from "../_components/sidebar";
import dynamic from 'next/dynamic'
import { useVideosStore } from '../zustand/useVideosStore';
import VideoList from '../_components/VideoList';
import Loading from '../_components/Loading';
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const YouTubeHome = () => {

    const [videoList, setVideoList] = useState([])
    const [loading, setLoading] = useState(true)

    const getVideoList = async () => {
        try{
            const res = await axios.get('http://localhost:8082/watch/home')
            setVideoList(res.data)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getVideoList()
    }, [])

    if(loading){
        return <Loading />
    }

   return (
       <div className='w-screen home-height bg-gray-800 flex'>
            <Sidebar tab={"home"} />
            <VideoList videoList={videoList} />
        </div>
   );
};

export default YouTubeHome;