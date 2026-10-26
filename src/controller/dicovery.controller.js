import { getFeed } from "../services/discovery.service.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { Profile } from "../models/profile.model.js";

export const getDiscoveryFeed = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { page, limit } = req.query;
 
  // Call the service layer
  const profiles = await getFeed(userId, page, limit);

  res.status(200).json({
    success: true,
    count: profiles.length,
    data: profiles
  });
});
