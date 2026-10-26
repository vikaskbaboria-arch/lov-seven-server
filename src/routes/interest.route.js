import { addInterest } from "../controller/interest.controller.js";
import { Router } from "express";
import { isAutheticated } from "../middleware/auth.middleware.js";
const router = Router();

router.route('/add').post(isAutheticated,addInterest)

export default router