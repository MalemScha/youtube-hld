import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function updateVideoDetailsToDB(id, transcodeUrl) {
    try{
        const videoData = await prisma.videoData.update({
            where: {
              id: id
            },
            data: {
              transcodeURL: transcodeUrl
            }
        })
          
        return videoData
    }catch(err){
        console.log(err)
    }
}