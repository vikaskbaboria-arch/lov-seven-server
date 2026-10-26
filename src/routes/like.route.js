import {CreateLike,getUserLikes,getMeLikes} from "../controller/like.controller.js"
import express from "express"
import { isAutheticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/like').post(isAutheticated,CreateLike);
router.route('/iliked').get(isAutheticated,getUserLikes);
router.route('/meliked').get(isAutheticated,getMeLikes);
export default router;