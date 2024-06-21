import React, { useEffect, useState } from 'react'
import HorizontalVideo from './HorizontalVideo'
import axios from 'axios'
import Loading from './Loading'

const SimilarVideos = () => {
  const [videoList, setVideoList] = useState([])
  const [loading, setLoading] = useState(true)

  const getRecommendedVideo = async () => {
    try{
        const res = await axios.get('http://localhost:8082/watch/topVideos')
        console.log(res)
        setVideoList(res.data)
    }catch(err){
        console.log(err)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getRecommendedVideo()
  }, [])

  if(loading){
    return <Loading noheight={true} />
  }
  return (
    <div className='pt-2 ml-2 flex flex-col grow'>
        {videoList?.map((video) => <HorizontalVideo video={video} />)}
    </div>
  )
}

export default SimilarVideos