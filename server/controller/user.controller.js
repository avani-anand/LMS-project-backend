import User  from "../models/user.model";
import AppError from "../utils/error.utils";
import cookie from "cookie-parser"


const cookieOptions={
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
    secure:true
}

const register =async (req,res)=>{
    const {fullName,email,password}= req.body;

    if(!fullName || !email || !password){
      //--------------------------------yha bar bar alag alag code likhte the phle hmlog ki ye na rhe to status code ye do vo do usse acha h ek jgah likh di aur usme bs messgae and status code send krte jae vo baki ka chiz smbhale isliye hum middleware bnaenge jo ki hoga "error.middleware.js"
       return next(new AppError('All fields are required',400));  //iss code m next likhe h mtlb yha agar jaise hi error aae to next m chla jae to next m app.js file m jaega niche code m

      //------------------------yha se jo v statusCode aur message vejnge vo "error.utils.js" m pas jaega lekin vha bs app error ka instance show hoga isliye ek middle ware hum bna rhe h"error.middleware.js" isi m jaega tb error print hoga
    }

    const userExist=await user.findOne({email});

    if (userExist) {
        return next(new AppError('email already exist'))
    }
    // agar user exist ni krta h to new account create krenge phle direct save kr dete the lekin ab two steps m save krenge phle user ka basic chiz name,email save kr denge datbase m uske bad user ka profile third party app se profile upload krbvaenge jb upload ho jaega to finally dobara se save krvaenge
    
    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:'https://cloudinary-marketing-res.cloudinary.com/image/upload/ar_0.5,c_fill,g_auto,w_433/q_auto/f_auto/hiking_dog_mountain.jpg'
        }
    })
    
    if(!user){
        return next(new AppError('user registration failed,please try again',400))
    }

    // to do : file upload
    await user.save();  //ab save kr denge user ko
    
    user.password=undefined;
    
    
    //ab user register ho gya to usko vpas se login krne ko to bolenge ni register kiya means vo login ho chuka h iske liye jwt token generate krenge
    const token=await user.generateJWTToken();

    res.cookie('token',token,cookieOptions)
    
    res.status(201).json({
        success: true,
        message:'user registered succesfully',
        user

    })
}



const login = (req,res)=>{

}
const logout = (req,res)=>{

}
const getprofile = (req,res)=>{

}



export {
    register,login,logout,getprofile
}