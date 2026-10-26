import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
   userId: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profile",
        },
      ],
      required: true,
      validate: {
        validator: (arr) =>
          arr.length === 2 &&
          arr[0].toString() !== arr[1].toString(),
        message: "A match must contain exactly two different users.",
      },
    },
    status:{
        type:String,
        enum:["matched","unmatched"],
        default:"matched"
    }
})
matchSchema.index({ userId: 1 });

export const Match = mongoose.model("Match",matchSchema);