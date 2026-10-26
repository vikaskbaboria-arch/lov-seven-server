import { Match } from "../models/match.model.js";
import { AppError, catchAsync } from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { isValidObjectId } from "mongoose";

const unMatch = catchAsync(async (req, res) => {
  const userId = req.user._d;
  const { toUser } = req.body;
  if (!toUser || !isValidObjectId(toUser)) {
    throw new AppError("Not a valid Info", 400);
  }
  const user = await Profile.findOne({
    userId: userId,
  });
  if (!user) {
    throw new AppError("User does not exists", 404);
  }
  const fromUser = user._id;
  const isMatchExists = await Match.findOne({
    userId: { $all: [fromUser, toUser] },
    status: "matched",
  });
  if (!isMatchExists) {
    throw new AppError("no such Matxh exists");
  }
  isMatchExists.status = "unmatched";
  await isMatchExists.save();
  return res.status(200).json({
    data: isMatchExists,
    message: "match unmatched",
  });
});

const getMatches = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const myProfile = await Profile.findOne({
    userId,
  });
  if (!myProfile) {
    throw new AppError("no user found please login", 401);
  }
  const matches = await Match.aggregate([
    { $match: { userId: myProfile._id, status: "matched" } },
    {
      $project: {
        otherProfileId: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$userId",
                as: "profileId",
                cond: { $ne: ["$$profileId", myProfile._id] },
              },
            },
            0,
          ],
        },
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "otherProfileId",
        foreignField: "_id",
        as: "profile",
      },
    },
    { $unwind: "$profile" },
    {
      $project: {
        _id: 0,
        matchId: "$_id",
        profile: {
          _id: "$profile._id",
          displayName: "$profile.displayName",
          profilePic: "$profile.profilePic",
          bio: "$profile.bio",
          gender: "$profile.gender",
          interests: "$profile.interests",
        },
        createdAt: 1,
      },
    },
  ]);


  return res.status(200).json({ success: true, count: matches.length, data: matches, });
});

export { unMatch , getMatches};
