import { create } from 'zustand'

export const useVideosStore = create((set) => ({
   searchedVideos: [],
   updateSearchedVideos: (videos) => set({searchedVideos: videos})
}))