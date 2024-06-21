"use client"
import React, {useState}  from 'react'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from "../_components/sidebar";
import { useMenuStore } from '../zustand/menuActiveStore';
import Login from '../_components/Login';

const UploadForm = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState({})
    const { menuActive } = useMenuStore()

    const {data} = useSession();

   const handleFileChange = (e) => {
       setSelectedFile(e.target.files[0]);
   };

   const handleUpload = async () => {
    if (!title || !description || !thumbnail || !data) {
      toast.error('Please fill all the details', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('filename', selectedFile.name);
      const initializeRes = await axios.post('http://localhost:8080/upload/initialize', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const { uploadId } = initializeRes.data;
      console.log('Upload id is ', uploadId);
 
      const chunkSize = 5 * 1024 * 1024; // 5 MB chunks
      const totalChunks = Math.ceil(selectedFile.size / chunkSize);
 
      let start = 0;

      const uploadPromises = [];

      setProgress({ current: 0, enabled: true, total: totalChunks })
 
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
 
        const chunk = selectedFile.slice(start, start + chunkSize);
        start += chunkSize;
        const chunkFormData = new FormData();
        chunkFormData.append('filename', selectedFile.name);
        chunkFormData.append('chunk', chunk);
        chunkFormData.append('totalChunks', totalChunks);
        chunkFormData.append('chunkIndex', chunkIndex);
        chunkFormData.append('uploadId', uploadId);
 
        const uploadPromise = axios.post('http://localhost:8080/upload', chunkFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          setProgress( prev => ({ current: prev.current+1, enabled: true, total: totalChunks }))
        });
        
       uploadPromises.push(uploadPromise);
      }

      await Promise.all(uploadPromises);

      const uploadFormData = new FormData()
      uploadFormData.append('filename', selectedFile.name)
      uploadFormData.append('totalChunks', totalChunks)
      uploadFormData.append('uploadId', uploadId)
      uploadFormData.append('title', title)
      uploadFormData.append('description', description)
      uploadFormData.append('author', data?.user?.name)
      uploadFormData.append('thumbnail', thumbnail)
 
      const completeRes = await axios.post('http://localhost:8080/upload/complete', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProgress({ current: 0, enabled: false, total: 0 })
      setTitle('')
      setDescription('')
      setSelectedFile(null)
      setThumbnail(null)
 
      toast.success('File Uploaded Succesfully', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: "Bounce"
      });
    } catch (error) {
      toast.error('An Error Occurred', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: "Bounce"
      });
      setProgress({ current: 0, enabled: false, total: 0 })
    }
  };

  if(!data){
    return <Login />
  }

 return (
      <div className='bg-gray-800 home-height w-screen flex'>
        {menuActive ? <Sidebar tab={"Upload"} /> : null}
        <div className='flex justify-center items-start mt-20 w-full'>
          <div className='p-10 bg-gray-900'>
            <div className='flex gap-4 text-white'>
                <div className="w-1/2">
                  <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-8">
                    <div className="text-center mt-2">
                      <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                      </svg>
                      { selectedFile ? <p className='text-gray-500 text-sm font-medium'>{selectedFile.name}</p> : null }
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label for="file-upload" className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">MP4, MKV, WMV up to 1GB</p>
                    </div>
                  </div>
                </div>
                <form encType="multipart/form-data" className='w-1/2'>
                  <div className="mb-4">
                    <input type="text"
                          name="title"
                          placeholder="Title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="py-2 w-full border-b bg-gray-900 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="mb-4">
                    <input type="text"
                          name="description"
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="py-2 w-full border-b bg-gray-900 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="my-5">
                    <label className="block mb-2 font-medium text-gray-400" for="default_size">Thumbnail</label>
                    <input onChange={(e) => setThumbnail(e.target.files[0])} className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file" />
                  </div>
                  
                </form>
              
            </div>
            <div className='flex flex-col pt-1'>
              { progress?.enabled ? 
              <>
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-sm text-gray-500">Uploading</span>
                  <span className="text-base font-medium text-sm text-gray-500">{`${Math.round(progress.current*100/progress.total)}%`}</span>
                </div>
                <div className="w-full rounded h-2.5 bg-gray-700 mb-4">
                  <div className="bg-blue-600 h-2.5 rounded" style={{ width: `${Math.round(progress.current*100/progress.total)}%`}}></div>
                </div>
              </>
              : null }

              <button
                    type="button"
                    onClick={handleUpload}
                    className="text-white grow bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Upload
              </button>
            </div>
          </div>
        </div>
        <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
      </div>
      
 )
}


export default UploadForm