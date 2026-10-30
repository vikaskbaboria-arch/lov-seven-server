import express from "express";
import {
    createReport,
    getMeReports,
    getUserReports,
} from "../controller/report.controller.js";
import { isAutheticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(isAutheticated, createReport);
router.route("/sent").get(isAutheticated, getUserReports);
router.route("/received").get(isAutheticated, getMeReports);

export default router;