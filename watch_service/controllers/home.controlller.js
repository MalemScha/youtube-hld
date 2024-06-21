import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient();

const getAllVideos = async(req, res) => {

    try {
        const allData = await prisma.$queryRaw`SELECT * FROM "VideoData"`;

        return res.status(200).send(allData);
      } catch (error) {
        console.log('Error fetching data:', error);
        return res.status(400).send();
      }
}

export const getVideo = async (req, res) => {
    const id  = parseInt(req.query.id)

    try {
        const data = await prisma.videoData.findFirst({
          where: {
            id: id
          }
        });
        return res.status(200).send(data);
      } catch (error) {
        console.log('Error fetching data:', error);
        return res.status(400).send();
      }
}

export const getTopVideos = async (req, res) => {

  try {
    const allData = await prisma.$queryRaw`SELECT * FROM "VideoData" LIMIT 6`;

    return res.status(200).send(allData);
  } catch (error) {
    console.log('Error fetching data:', error);
    return res.status(400).send();
  }
}

export default getAllVideos;