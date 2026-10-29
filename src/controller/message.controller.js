import { Message } from "../models/message.model.js";
import { Match } from "../models/match.model.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { isValidObjectId } from "mongoose";
import { AppError } from "../middleware/error.middleware.js";
import { Profile } from "../models/profile.model.js";

const sendMessage = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const { text, conversationId } = req.body;
    if (text == null || !isValidObjectId(conversationId)) {
        throw new AppError("please provide valid info ", 400);
    }
    if (!userId) {
        throw new AppError("First login please", 401);
    }
    const profile = await Profile.findOne({ userId });
    const match = await Match.findOne({
        _id: conversationId,
        userId: profile._id,
    });
    if (!match) {
        throw new AppError("no such match is there", 404);
    }
    const createMessage = await Message.create({
        senderId: profile._id,
        content: text,
        matchId: match._id,
    });
    if (!createMessage) {
        throw new AppError("Message not created", 500);
    }
//       const io = getIO();
//   if (io) {
//     io.to(`conversation:${conversationId}`).emit("message:received", populatedMessage);
//   }
   const io = req.app.get('io');
    if (io) { 
    let recipients = io.to(`conversation:${conversationId}`);
    match.userId.forEach((memberId) => {
      recipients = recipients.to(`user:${memberId}`);
    });
    recipients.emit("message:new", createMessage.toObject());
  }
    return res.status(200).json({
        data: createMessage,
        message: "message sended succesfully",
    });
});

const getConversation = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const {convId} = req.params;
    if (!userId) {
        throw new AppError("First login please", 401);
    }
    const profile = await Profile.findOne({ userId });
    const match = await Match.findOne({
        _id: convId,
        userId: profile._id,
    });
    if (!match) {
        throw new AppError("no such match is there", 404);
    }
    const messages = await Message.find({
        matchId:convId
    }).populate("senderId" , "_id displayName").
    sort({createdAt:-1});
    if(messages.length===0){
            return res.status(200).json({
                data:[],
                message:"no message found"
            })
    }
        return res.status(200).json({
                data:messages,
                message:"no message found"
            })
});

export { sendMessage ,getConversation};
