import mongoose , {Schema , Types } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

const userSchema = new Schema({
        username : {
               type : String , 
               unique : true , 
               index : true , 
               lowercase : true , 
               trim : true , 
               required : true 
        } , 

        email : {
                 type : String , 
                 unique : true , 
                 lowercase : true , 
                 trim : true , 
                 required : true 
        }, 

        password : {
                 type : String , 
                 trim : true , 
                 required : true 
        }, 

        fullName : {
               type : String , 
               unique : true , 
               index : true , 
               lowercase : true , 
               trim : true , 
               required : true 
        }, 

        refreshToken : {
                type : String
        }

})

// hash password : 
userSchema.pre('save' , async function (next) {
   if(!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password , 10)
  next()
})

// compare password : 
userSchema.methods.isPasswordCorrect = async function (enterPassword) {
  
  return await bcrypt.compare(enterPassword , this.password)
}


userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESSTOKEN_SECRETKEY,
    {
      expiresIn: process.env.ACCESSTOKEN_EXPIRYDATE,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESHTOKEN_SECRETKEY,
    {
      expiresIn: process.env.REFRESHTOKEN_EXPIRYDATE,
    }
  );
};



export const User = mongoose.model("User" , userSchema)