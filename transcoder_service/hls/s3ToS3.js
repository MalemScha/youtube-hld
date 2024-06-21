import dotenv from "dotenv";
import AWS from 'aws-sdk';
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg"
import ffmpegStatic from "ffmpeg-static"
import { updateVideoDetailsToDB } from "../db/db.js";
ffmpeg.setFfmpegPath(ffmpegStatic)

dotenv.config();

const s3 = new AWS.S3({
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// const mp4FileName = 'trial1.mp4';
const bucketName = process.env.AWS_BUCKET;
const hlsFolder = 'hls_output';


const s3ToS3 = async (title, key, videoId) => {
   console.log(videoId)
   console.log('Starting script');
   console.time('req_time');

   const mp4FileName = title
   try {
       console.log('Downloading s3 mp4 file locally');

       const writeStream = fs.createWriteStream('local.mp4');
        console.log("key--------- ", key)

       const readStream = s3
           .getObject({ Bucket: bucketName, Key: key })
           .createReadStream();
       readStream.pipe(writeStream);
       await new Promise((resolve, reject) => {
           writeStream.on('finish', resolve);
           writeStream.on('error', reject);
       });
       console.log('Downloaded s3 mp4 file locally');


       const resolutions = [
           {
               resolution: '320x180',
               videoBitrate: '500k',
               audioBitrate: '64k'
           },
           {
               resolution: '854x480',
               videoBitrate: '1000k',
               audioBitrate: '128k'
           },
           {
               resolution: '1280x720',
               videoBitrate: '2500k',
               audioBitrate: '192k'
           }
       ];


       const variantPlaylists = [];
       for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
           console.log(`HLS conversion starting for ${resolution}`);
           const outputFileName = `${mp4FileName.replace(
               '.',
               '_'
           )}_${resolution}.m3u8`;
           const segmentFileName = `${mp4FileName.replace(
               '.',
               '_'
           )}_${resolution}_%03d.ts`;
           await new Promise((resolve, reject) => {
               ffmpeg('local.mp4')
                   .outputOptions([
                       `-c:v h264`,
                       `-b:v ${videoBitrate}`,
                       `-c:a aac`,
                       `-b:a ${audioBitrate}`,
                       `-vf scale=${resolution}`,
                       `-f hls`,
                       `-hls_time 10`,
                       `-hls_list_size 0`,
                       `-hls_segment_filename hls_output/${segmentFileName}`
                   ])
                   .output(`hls_output/${outputFileName}`)
                   .on('end', () => resolve())
                   .on('error', (err) => reject(err))
                   .run();
           });
           const variantPlaylist = {
               resolution,
               outputFileName
           };
           variantPlaylists.push(variantPlaylist);
           console.log(`HLS conversion done for ${resolution}`);
       }
       console.log(`HLS master m3u8 playlist generating`);
       let masterPlaylist = variantPlaylists
           .map((variantPlaylist) => {
               const { resolution, outputFileName } = variantPlaylist;
               const bandwidth =
                   resolution === '320x180'
                       ? 676800
                       : resolution === '854x480'
                       ? 1353600
                       : 3230400;
               return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
           })
           .join('\n');
       masterPlaylist = `#EXTM3U\n` + masterPlaylist;


       const masterPlaylistFileName = `${mp4FileName.replace(
           '.',
           '_'
       )}_master.m3u8`;
       const masterPlaylistPath = `hls_output/${masterPlaylistFileName}`;
       fs.writeFileSync(masterPlaylistPath, masterPlaylist);
       console.log(`HLS master m3u8 playlist generated - ${masterPlaylistPath}`);

       console.log(`Deleting locally downloaded s3 mp4 file`);


       fs.unlinkSync('local.mp4');
       console.log(`Deleted locally downloaded s3 mp4 file`);


       console.log(`Uploading media m3u8 playlists and ts segments to s3`);


       const files = fs.readdirSync(hlsFolder);
       for (const file of files) {
           if (!file.startsWith(mp4FileName.replace('.', '_'))) {
               continue;
           }
           const filePath = path.join(hlsFolder, file);
           const fileStream = fs.createReadStream(filePath);
           const uploadParams = {
               Bucket: bucketName,
               Key: `${hlsFolder}/${file}`,
               Body: fileStream,
               ContentType: file.endsWith('.ts')
                   ? 'video/mp2t'
                   : file.endsWith('.m3u8')
                   ? 'application/x-mpegURL'
                   : null
           };
           await s3.upload(uploadParams).promise();
           fs.unlinkSync(filePath);
       }
       console.log(
           `Uploaded media m3u8 playlists and ts segments to s3. Also deleted locally`
       );

       const transcodeUrl = `https://${bucketName}.s3.amazonaws.com/${masterPlaylistPath}`

       const result = await updateVideoDetailsToDB(videoId, transcodeUrl)
       console.log(result)

       console.log('Success. Time taken: ');
       console.timeEnd('req_time');
   } catch (error) {
       console.error('Error:', error);
   }
};


export default s3ToS3;
