import mongoose  from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



const adminSchema = new mongoose.Schema({

    username : {
        type : String,
        required : [true, "Username is required"],
        lowercase : true,
        trim : true,

    },
    email : {
        type : String,
        required : [true, "Email is required"],
        lowercase : true,
        trim : true,
        unique : true,

    },
    driverId : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Driver"
        }
    ],
    password : {
        type : String,
        required : [true , "Password is required"]
    },
    refrreshToken : {
        type : String,
    }


},{
    timestamps : true
})

// custom middleware to hash password before saving
adminSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password , 10)
    next()
})

// method to compare password 
adminSchema.methods.isPasswordCorrect = async function(password){

    return await bcrypt.compare(password , this.password)
}

// method to generate access token 
adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id : this._id,
        email : this.email,
        username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// method to generate refresh token 
adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id : this._id,
        
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Admin = mongoose.model("Admin", adminSchema)