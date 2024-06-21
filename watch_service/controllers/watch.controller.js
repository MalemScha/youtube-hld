import AWS from "aws-sdk"

async function generateSignedUrl(videoKey) {

   const s3 = new AWS.S3({
       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
       region: process.env.AWS_REGION
   });

   const params = {
       Bucket: process.env.AWS_BUCKET,
       Key: videoKey,
       Expires: 3600 // URL expires in 1 hour, adjust as needed
   };

   return new Promise((resolve, reject) => {
       s3.getSignedUrl('getObject', params, (err, url) => {
           if (err) {
               reject(err);
           } else {
               resolve(url);
           }
       });
   });
}

const watchVideo = async (req, res) => {
   try {
       const videoKey = req.query.key; // Key of the video file in S3
       const signedUrl = await generateSignedUrl(videoKey);
       res.json({ signedUrl });
   } catch (err) {
       console.error('Error generating pre-signed URL:', err);
       res.status(500).json({ error: 'Internal Server Error' });
   }
}

export default watchVideo;