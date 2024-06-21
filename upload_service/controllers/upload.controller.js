import AWS from 'aws-sdk';

const uploadFileToS3 = async(req, res) => {

   console.log('Upload req received');

   if(!req.files || !req.files['chunk'] || !req.body['totalChunks'] || !req.body['chunkIndex']){
      return res.status(400).send('Missing data required')
   }

   const chunk = req.files['chunk']
   const filename = req.body['filename']
   const totalChunks = parseInt(req.body['totalChunks'])
   const chunkIndex = parseInt(req.body['chunkIndex'])

   AWS.config.update({
       region: process.env.AWS_REGION,
       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
   });

   const params = {
       Bucket: process.env.AWS_BUCKET,
       Key: `${filename}_chunk_${chunkIndex}`,
       Body: chunk[0].buffer
   };

   const s3 = new AWS.S3();

   // Upload the file to S3
   s3.upload(params, (err, data) => {
       if (err) {
           console.log('Error uploading file:', err);
           res.status(404).send('File could not be uploaded!');
       } else {
           console.log('File uploaded successfully. File location:', data.Location);
           res.status(200).send('File uploaded successfully');
       }
   });
}


export default uploadFileToS3;