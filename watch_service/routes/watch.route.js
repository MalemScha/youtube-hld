import express from "express"
import watchVideo from "../controllers/watch.controller.js";
import getAllVideos, { getTopVideos, getVideo } from "../controllers/home.controlller.js";

const router = express.Router();

router.get('/', watchVideo);

router.get('/home', getAllVideos);

router.get('/video', getVideo)

router.get('/topVideos', getTopVideos)

export default router;