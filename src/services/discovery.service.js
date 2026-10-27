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
  const feed = await Profile.find();
  console.log("feed",feed)
  if(!feed){
    throw new AppError("no feed try again after some time",500)
  }
  return feed;

};

export {getFeed}
