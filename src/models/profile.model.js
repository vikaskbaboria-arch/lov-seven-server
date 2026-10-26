import mongoose from "mongoose"
const profileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
        unique:true
    },
    age:{
     type:Number
    },
    minAge:{
       type:Number
    },
    maxAge:{
        type:Number
    },
    displayName:{
        type:String,
        trim:true,
    
        maxLength:50,
        minLength:3
    },
    bio:{
        type:String
    },
    profilePic:{
        type:String
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    InterestedIn:{
        type:String,
        enum:["male","female"]
    },
     location: {
      type: {
        type: String,
        enum: ["Point"],
        default: undefined,
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },

    isDiscoverable:{
        type:Boolean,
        default:false
    },
    // Inside profileSchema...
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interest"
  }],
    
},{
    timestamps:true
})


// 2. Geospatial discovery
profileSchema.index({ location: "2dsphere" });

// 3. Discovery filtering
profileSchema.index({
  isDiscoverable: 1,
  gender: 1,
});
export const Profile = mongoose.model("Profile",profileSchema)