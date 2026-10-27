import express from "express";
import{craeteProfile, getProfileById,getCurrentUserProfile} from "../controller/profile.controller.js"
import { isAutheticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/createProfile').post(isAutheticated,craeteProfile);
router.route('/user/:profileId').get(isAutheticated,getProfileById)
router.route('/').get(isAutheticated,getCurrentUserProfile)


export default router;