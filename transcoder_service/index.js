import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import KafkaConfig from "./kafka/kafka.js";
import convertToHLS from "./hls/transcode.js";
import s3ToS3 from "./hls/s3ToS3.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
   allowedHeaders: ["*"],
   origin: "*"
}));

app.use(express.json());

const kafkaconfig =  new KafkaConfig()

kafkaconfig.consume("transcode", (value)=>{
   const res = JSON.parse(value)
   s3ToS3(res.title, res.key, res.videoId)
})

app.get('/', (req, res) => {
   res.send('HHLD YouTube Transcoder')
})

app.get('/transcode', (req, res) => {
   convertToHLS()
   res.send("Transcoding done")
})

app.listen(port, () => {
   console.log(`Server is listening at ${port}`);
})
