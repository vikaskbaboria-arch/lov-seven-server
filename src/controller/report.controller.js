import { Report } from "../models/report.model.js";
import { AppError, catchAsync } from "../middleware/error.middleware.js";
import { isValidObjectId } from "mongoose";
import { Profile } from "../models/user.model.js";

const createReport = catchAsync(async (req, res) => {
  const { reportedUser, reason, description } = req.body ?? {};

  if (!isValidObjectId(reportedUser)) {
    throw new AppError("A valid reportedUser is required", 400);
  }
  if (!reason) {
    throw new AppError("A report reason is required", 400);
  }
  if (String(req.profile._id) === String(reportedUser)) {
    throw new AppError("You cannot report yourself", 400);
  }

  const targetUser = await Profile.findById(reportedUser);
  if (!targetUser) {
    throw new AppError("Reported user not found", 404);
  }

  const report = await Report.create({
    reportedBy: req.profile._id,
    reportedUser,
    reason,
    description,
  });
  await report.populate("reportedUser", "name");

  return res.status(201).json({
    data: report,
    message: "Report submitted successfully",
  });
});

const getUserReports = catchAsync(async (req, res) => {
  const reports = await Report.find({ reportedBy: req.profile._id })
    .populate("reportedUser", "name")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    data: reports,
    count: reports.length,
    message: "Reports submitted by you found",
  });
});

const getMeReports = catchAsync(async (req, res) => {
  const reports = await Report.find({ reportedUser: req.profile._id })
    .populate("reportedBy", "name")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    data: reports,
    count: reports.length,
    message: "Reports about you found",
  });
});

export { createReport, getUserReports, getMeReports };