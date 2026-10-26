import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    fromUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true
    },
    toUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true
    },
    action:{
        type:String,
        enum:["like","pass"]
    }
},{
    timestamps:true
})

likeSchema.index({ fromUser: 1, toUser: 1 },{unique:true});
likeSchema.index({ toUser: 1 });

export const Like = mongoose.model("Like", likeSchema);