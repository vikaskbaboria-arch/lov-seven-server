import { Profile } from "../models/profile.model.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import { AppError } from "../middleware/error.middleware.js";
import { isValidObjectId } from "mongoose";
const craeteProfile = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!userId || !user) {
    throw new AppError("please login", 401);
  }
  const {
    displayName,
    bio,
    profilePic,
    gender,
    interestedIn,
  
    location,
    age,
    minAge,
    maxAge
  } = req.body;
  const profile = await Profile.findOne({ userId: userId });
  if (!profile) {
    throw new AppError("Profile not found", 404);
  }
  if (displayName != undefined) {
    profile.displayName = displayName;
  }
  if (bio != undefined) {
    profile.bio = bio;
  }
  if (profilePic != undefined) {
    profile.profilePic = profilePic;
  }
  if (gender != undefined) {
    profile.gender = gender;
  }
  if (interestedIn != undefined) {
    profile.InterestedIn = interestedIn;
  }
  if (location != undefined) {
    profile.location = location;
  }
    if(age!=undefined){
    profile.age =age;
  }
  if(minAge!=undefined){
    profile.minAge =minAge;
  }
   if(maxAge!=undefined){
    profile.maxAge =maxAge;
  }
  const isProfileComplete = Boolean(
    profile.displayName &&
    profile.bio &&
    profile.profilePic &&
    profile.gender &&
    profile.InterestedIn &&
    profile.age &&
    profile.minAge &&
    profile.maxAge &&
    profile.location?.coordinates?.length === 2 
  );

  profile.isDiscoverable = true;
  await profile.save();
 
  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    profile,
  });
});
const getProfileById = catchAsync(async (req, res) => {
  const { profileId } = req.params;
  if (!isValidObjectId(profileId)) {
    throw new AppError("profileId is not valid", 400);
  }
  const profile = await Profile.findById(profileId);

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  return res.status(200).json({
    success: true,
    profile,
  });
});

const getCurrentUserProfile = catchAsync(async (req, res) => {
     const userId = req.user._id;
  const u = await User.findById(userId);
  if (!userId || !u) {
    throw new AppError("please login", 401);
  }
  const user = await Profile.findOne({
    userId:u._id
  }).populate("interests","name")


  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...user.toJSON()
    
    },
  });
});
export { craeteProfile, getProfileById ,getCurrentUserProfile};
