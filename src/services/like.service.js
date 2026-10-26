
import { Like } from "../models/like.model.js";
import { Match } from "../models/match.model.js";
import { AppError } from "../middleware/error.middleware.js";
import { Profile } from "../models/profile.model.js";
export const likeORPass = async ({ action, fromUser, toUser }) => {

    // 1. Validate action
    console.log(action)
    console.log(toUser)
    if (!["like", "pass"].includes(action)) {
        throw new AppError("Invalid action", 400);
    }

    // 2. Prevent self-swiping
    if (fromUser.toString() === toUser.toString()) {
        throw new AppError("You cannot swipe on yourself", 400);
    }

    // 3. Check whether a swipe already exists
    const existingSwipe = await Like.findOne({
        fromUser: fromUser,
        toUser,
        action
    });

    if (existingSwipe) {
        throw new AppError("You have already swiped on this user", 409);
    }

    // 4. Save the swipe
   const liku= await Like.create({
        fromUser: fromUser,
        toUser,
        action,
    });
//   console.log(liku)
    // 5. If the action is PASS, stop here
    if (action === "pass") {
        return {
            success: true,
            action: "pass",
            isMatched: false,
        };
    }

    // 6. Find a reverse LIKE
    const reverseLiked = await Like.findOne({
        fromUser: toUser,
        toUser: fromUser,
        action: "like",
    });

    // 7. No reverse like means no match
    if (!reverseLiked) {
        return {
            success: true,
            action: "like",
            isMatched: false,
        };
    }

    // 8. Check whether a match already exists
    const existingMatch = await Match.findOne({
        userId: { $all: [fromUser, toUser] },
    });

    if (existingMatch) {
        return {
            success: true,
            action: "like",
            isMatched: true,
            match: existingMatch,
        };
    }

    // 9. Create a match because both users liked each other
    const match = await Match.create({
        userId: [fromUser, toUser],
    });

    return {
        success: true,
        action: "like",
        isMatched: true,
        match,
    };
};