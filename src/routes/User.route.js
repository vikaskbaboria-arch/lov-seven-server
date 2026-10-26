import express from "express";
import {regsiterUser,loginUser,signOut,getCurrentUserProfile} from "../controller/User.controller.js"
import { isAutheticated } from "../middleware/auth.middleware.js";

const router = express.Router();


router.route('/registerUser').post(regsiterUser);
router.route('/login').post(loginUser);
router.route('/signout').post(signOut);

router.route('/getCurrentUser').get(isAutheticated,getCurrentUserProfile)

export default router;