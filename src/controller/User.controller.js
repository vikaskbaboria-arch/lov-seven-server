import { User } from "../models/user.model.js";
import {generateToken} from "../utils/generateToken.js";
import { catchAsync } from "../middleware/error.middleware.js";
import {Profile} from "../models/profile.model.js"
import { AppError } from "../middleware/error.middleware.js";

const regsiterUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new AppError("password and email as well as name is required", 401);
  }
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User already exist with this email", 400);
  }
  const CreateUser = await User.create({
    name: name,
    email: email.toLowerCase(),
    passwordHash: password,
  });
  if (!CreateUser) {
    throw new AppError("Server side error ", 500);
  }
  const createProfile = await Profile.create({
    userId:CreateUser._id
  })
   if (!createProfile) {
    throw new AppError("Server side error ", 500);
  }
 
  return generateToken(res, CreateUser, "Account created Suuucessfullyy");
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash",
  );
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }
  return generateToken(res, user, "User logged in successfully");
});

const signOut = catchAsync(
    async(_,res)=>{
        res.cookie('token','',{maxAge:0});
          res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
    }
)
const getCurrentUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.id)


  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...user.toJSON()
    
    },
  });
});
export {regsiterUser,loginUser,signOut,getCurrentUserProfile}