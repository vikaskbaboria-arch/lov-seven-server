import {unMatch , getMatches} from "../controller/match.controller.js"
import express from "express"
import { isAutheticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/unmatch').patch(isAutheticated,unMatch);
router.route('/getMatches').get(isAutheticated,getMatches);

export default router;