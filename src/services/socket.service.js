import { Server } from "socket.io";
import jwt from "jsonwebtoken";
// In server/src/services/socket.service.js, add to imports:
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Match } from "../models/match.model.js";
import { Profile } from "../models/profile.model.js";
export const initializwSocketServer = (httpServer) => {
  const io = new Server(httpServer,{
    cors:{
      origin:"*",
       credentials: true,
    }
  });
  io.use(async (socket, next) => {
    try {
   // In server/src/services/socket.service.js:
const cookieHeader = socket.handshake.headers?.cookie || "";
const cookieToken = cookieHeader.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1];
const token = socket.handshake.auth?.token || cookieToken || socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, "");
      if (!token) {
        return next(new Error("Authentication required"));
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken?.userId).select("_id");
      if (!user) {
        return next(new Error("Auth required"));
      }
      const profile = await Profile.findOne({userId:user._id})
      socket.data.userId = String(user._id);
      socket.data.profileId = String(profile._id)
      return next();
    } catch {
      return next(new Error("Invalid access token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.profileId;
    socket.join(`user:${userId}`);
    socket.on("conversation:join", async (playload = {}, acknowledge) => {
      const conversationId = playload.conversationId;
      if (!isValidObjectId(conversationId)) {
        acknowledge?.({ success: false, message: "Invalid conversation ID" });
        return;
      }
      try {
        const isMember = await Match.find({
          _id: conversationId,
          userId: userId,
        });
        if (!isMember) {
          acknowledge?.({
            success: false,
            message: "not a conversation member",
          });
        }
        socket.join(`conversation:${conversationId}`);
        acknowledge?.({ success: true });
      } catch (error) {
        acknowledge?.({
          success: false,
          message: "Could not join conversation",
        });
      }
    });
    socket.on("conversation:leave", (payload = {}) => {
      if (isValidObjectId(payload.conversationId)) {
        socket.leave(`conversation:${payload.conversationId}`);
      }
    });
  });
  return io;

};
