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
  const maxDistanceInMeters = ( 500) * 1000
  
  const swiped = await Like.find({ fromUser: myProfile._id }).distinct('toUser');
  console.log("swiped",swiped)
 const exclusionList = [
  myProfile._id,
  ...swiped,
];


//iscovery.service.js (Phase 2)
console.log("myProfile",myProfile.InterestedIn)
  const feed = await Profile.aggregate([
    {
      $geoNear:{
        near:{type:'Point',coordinates:myProfile.location.coordinates},
        distanceField:"distance",
        maxDistance:maxDistanceInMeters,
        query:{
          _id:{$nin : exclusionList},
          gender:myProfile.InterestedIn,
          InterestedIn:myProfile.gender
        }
      }
    },
   

    // 4. Pagination
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) },
  ]);
  console.log("feed",feed)
  if(!feed){
    throw new AppError("no feed try again after some time",500)
  }
  return feed;

};

export {getFeed}
