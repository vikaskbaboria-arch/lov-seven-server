import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true // Saves "Hiking" and "hiking" as the same thing
  },
  category: {
    type: String,
    enum: ["sports", "arts", "music", "food", "lifestyle", "other"],
    default: "other"
  },
  icon: {
    type: String // e.g., an emoji '⚽' or an image URL
  }
});

export const Interest = mongoose.model("Interest", interestSchema);