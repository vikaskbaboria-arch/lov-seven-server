import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    content: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1000,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ matchId: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);