import React from 'react'
import { VideoCard } from './VideoCard'

const VideoList = ({ videoList }) => {
  return (
    <div className='p-4 grid grid-cols-4 gap-8 mx-auto mt-4 overflow-y-scroll'>
       { videoList?.map((video) => <VideoCard video={video} />) }
    </div>
  )
}

export default VideoList