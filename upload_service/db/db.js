import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function addVideoDetailsToDB(title, description, author, url, thumbnail) {
 const videoData = await prisma.videoData.create({
  data: {
      title: title,
      description: description,
      author: author,
      url: url,
      transcodeURL: '',
      thumbnail: thumbnail
  } })

  return videoData
}