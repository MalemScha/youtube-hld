import { useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import Hls from 'hls.js';

export const VideoCard = ({ video }) => {

  const router = useRouter()

  const handleClick = () => router.push(`/video?id=${video.id}`);

  const videoRef = useRef(null);
  const src = video.transcodeURL;

   useEffect(() => {
       const video = videoRef.current;

       if (Hls.isSupported()) {
           console.log("HLS is supported");
               console.log(src);
               const hls = new Hls();
               hls.attachMedia(video);
               hls.loadSource(src);
               hls.on(Hls.Events.MANIFEST_PARSED, function () {
                  //  console.log("playing video");
                  //  video.play();
               });
       } else {
           console.log('HLS is not supported');
           // Play from the original video file
       }
   }, [src]);
  
  return (
    <div onClick={handleClick} className={`border rounded-lg shadow bg-gray-800 border-gray-700 h-fit max-w-72 relative hover:scale-y-110	 hover:scale-x-110 cursor-pointer`}>
      <a className={`group relative overflow-none`}>
        <img className={`rounded-t-lg group-hover:hidden object-cover vcard-img`} src={video.thumbnail} alt="" />
        <video className={`hidden group-hover:block object-cover vcard`} loop muted ref={videoRef}
          onMouseEnter={event => event.target.play()} onMouseLeave={event => event.target.pause()}/>
      </a>
      <div className="p-3">
        <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{video.title}</h5>
        <p className="font-normal text-gray-400">{video.description}</p>
      </div>
    </div>
  )
}
