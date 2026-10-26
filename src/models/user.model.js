import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    passwordHash:{
        type:String,
        required:true,
        minLength:8
    },
    email:{
        type:String,
        required:true,
        unique:true
        ,
        trim:true
    },
    isEmailVerified:{
        type:Boolean
    },
    role:{
        type:String,
        enum:[
            "user","admin"
        ],
        default:"user"
    }

},{
    timestamps:true
})


userSchema.pre('save',async function () {
    if(!this.isModified("passwordHash")){
        return
    }
    this.passwordHash = await bcrypt.hash(this.passwordHash,12)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.passwordHash)
}




export const User = mongoose.model("User", userSchema);