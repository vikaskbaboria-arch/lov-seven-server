import express from "express"
import { isAutheticated } from "../middleware/auth.middleware.js";
import {getConversation,sendMessage}  from "../controller/message.controller.js"
const router = express.Router();

router.route('/sendMessage').post(isAutheticated,sendMessage);

router.route('/getChat:convId').get(isAutheticated,getConversation)

export default router