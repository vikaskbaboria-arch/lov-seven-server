import { AppError } from "../middleware/error.middleware.js";
import { Profile } from "../models/profile.model.js";
import {Like} from "../models/like.model.js"
import { Match } from "../models/match.model.js";
const getFeed = async (userId, page, limit) => {
  console.log("userID",userId)
  const myProfile = await Profile.findOne({ userId:userId });
  if (!myProfile) {
    throw new AppError("no profile found", 404);
  }
  const maxDistanceInMeters = (myProfile.maxDistance || 50) * 1000
  
  const swiped = await Like.find({ fromUser: myProfile._id }).distinct('toUser');
  console.log(swiped)
 const exclusionList = [
  myProfile._id,
  ...swiped,
];
  console.log(exclusionList)

//iscovery.service.js (Phase 2)
  const feed = await Profile.aggregate([
    // 1. The Hard Filters (Location, Age, Gender, Exclusion List)
    {
      $geoNear: {
        near: { type: "Point", coordinates: myProfile.location.coordinates },
        distanceField: "distance",
        maxDistance: maxDistanceInMeters,
        query: {
          _id: { $nin: exclusionList },
          isDiscoverable: true,
          gender: myProfile.InterestedIn,
          InterestedIn: myProfile.gender,
          age: { $gte: myProfile.minAge, $lte: myProfile.maxAge },
        },
      },
    },
    // 2. The Scoring System (Calculate shared interests)
    {
      $addFields: {
        sharedInterests: {
          $setIntersection: ["$interests", myProfile.interests],
        },
      },
    },
    {
      $addFields: {
        matchScore: { $size: { $ifNull: ["$sharedInterests", []] } }, // Counts matching tags
      },
    },
    // 3. Sort by highest match score, then by closest distance
    { $sort: { matchScore: -1, distance: 1 } },
    // 4. Pagination
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) },
  ]);
  if(!feed){
    throw new AppError("no feed try again after some time",500)
  }
  return feed;

};

export {getFeed}
