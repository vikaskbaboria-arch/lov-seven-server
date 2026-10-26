import { Interest } from "../models/interest.model.js";
import { Profile } from "../models/profile.model.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { isValidObjectId } from "mongoose";
import { AppError } from "../middleware/error.middleware.js";



const addInterest = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { interests } = req.body;

  const profile = await Profile.findOne({ userId: userId });
  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  // 1. Better validation: If no interests array is provided, throw an error
  if (!interests || !Array.isArray(interests)) {
    throw new AppError("Please provide an array of interests", 400);
  }

  const interestIds = [];

  for (let interestName of interests) {
    // 2. CRITICAL FIX: Ensure it is a string before calling .trim()
    if (typeof interestName !== "string" || !interestName.trim()) {
      continue; 
    }

    const cleanName = interestName.trim().toLowerCase();
    let existingInterest = await Interest.findOne({ name: cleanName });

    if (!existingInterest) {
      existingInterest = await Interest.create({ name: cleanName });
    }

    interestIds.push(existingInterest._id);
  }

  profile.interests = interestIds;

  // 3. CRITICAL FIX: Added Optional Chaining (?.) to prevent crashes if location is missing
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

  profile.isDiscoverable = isProfileComplete;
  
  await profile.save();

  // 4. Populate the data so the frontend gets the names, not just raw ObjectIds
  await profile.populate('interests', 'name');

  res.status(200).json({
    success: true,
    message: "Interests updated successfully",
    profile
  });
});



export {addInterest}