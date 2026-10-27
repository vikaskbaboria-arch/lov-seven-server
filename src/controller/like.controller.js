import { Like } from "../models/like.model.js";
import { AppError, catchAsync } from "../middleware/error.middleware.js";
import { likeORPass } from "../services/like.service.js";
import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import mongoose from "mongoose";
const CreateLike = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { action, toUser } = req.body;
  const fromUser = await Profile.findOne({
    userId: userId,
  });
  if (!action || !toUser) {
    throw new AppError("action and to USer is required");
  }
  const isToUSer = await Profile.findById(toUser);
  if (!isToUSer) {
    throw new AppError("toUser does not exits", 404);
  }
  const response = await likeORPass({action, fromUser, toUser});

  return res
    .status(200)
    .json({ message: "Swipe processed successfully", data: response });
});

const getUserLikes = catchAsync(async (req, res) => {
  const UserId = req.user._id;
  const myProfile = await Profile.findOne({ userId: UserId });
  const myProfileObjectId = new mongoose.Types.ObjectId(myProfile._id);
 const likes = await Like.aggregate([
    // Match likes sent by the current user
    {
      $match: {
        fromUser: myProfileObjectId,
        action: "like",
      },
    },
    // Exclude if already matched with toUser
    {
      $lookup: {
        from: "matches",
        let: { targetUserId: "$toUser" },
        pipeline: [
          {
            $match: {
              status: "matched",
              $expr: {
                $and: [
                  { $in: [myProfileObjectId, "$userId"] },
                  { $in: ["$$targetUserId", "$userId"] },
                ],
              },
            },
          },
        ],
        as: "existingMatch",
      },
    },
    {
      $match: {
        "existingMatch.0": { $exists: false },
      },
    },
    // Lookup the profile of the person who was LIKED (toUser)
    {
      $lookup: {
        from: "profiles",
        localField: "toUser",
        foreignField: "_id",
        as: "targetProfile",
      },
    },
    {
      $unwind: "$targetProfile",
    },
    // Format the response
    {
      $project: {
        _id: 1,
        action: 1,
        createdAt: 1,
        likedUser: {
          _id: "$targetProfile._id",
          displayName: "$targetProfile.displayName",
          profilePic: "$targetProfile.profilePic",
          location: "$targetProfile.location",
          bio: "$targetProfile.bio",
          age: "$targetProfile.age",
        },
      },
    },
  ]);
 console.log(likes)
  if (likes.length == 0) {
    throw new AppError("likes not found", 404);
  }

  return res.status(200).json({
    data: likes,
    count: likes.length,
    message: "likes found",
  });
});
const getMeLikes = catchAsync(async (req, res) => {
  const UserId = req.user._id;
  const profileId = await Profile.findOne({ userId: UserId });
  const myProfileId = new mongoose.Types.ObjectId(profileId._id);
  const likes = await Like.aggregate([
    {
      $match: {
        toUser: myProfileId,
        action: "like",
      },
    },
    {
      $lookup: {
        from: "matches",
        let: { senderId: "$fromUser" },
        pipeline: [
          {
            $match: {
              status: "matched",
              $expr: {
                $and: [
                  { $in: [myProfileId, "$userId"] },
                  { $in: ["$$senderId", "$userId"] },
                ],
              },
            },
          },
        ],
        as: "existingMatch",
      },
    },
    {
      $match: {
        "existingMatch.0": { $exists: false },
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "fromUser",
        foreignField: "_id",
        as: "senderProfile",
      },
    },
    {
      $unwind: "$senderProfile",
    },
    {
      $project: {
        _id: 1,
        action: 1,
        createdAt: 1,
        fromUser: {
          _id: "$senderProfile._id",
          displayName: "$senderProfile.displayName",
          profilePic: "$senderProfile.profilePic",
          gender:"$senderProfile.gender",
          location: "$senderProfile.location",
        },
      },
    },
  ]);
 

  return res.status(200).json({
    data: likes,
    count: likes.length,
    message: "likes found",
  });
});
export { CreateLike, getUserLikes, getMeLikes };
