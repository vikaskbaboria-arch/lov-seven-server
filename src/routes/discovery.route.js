import { getDiscoveryFeed } from "../controller/dicovery.controller.js";
import { isAutheticated } from "../middleware/auth.middleware.js";
import {Router } from "express";

const router = Router();

router.route("/").get(isAutheticated,getDiscoveryFeed)

export default router