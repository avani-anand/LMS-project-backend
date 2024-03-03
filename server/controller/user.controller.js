import fs from 'fs/promises';


import User  from "../models/user.model.js";
import cookie from "cookie-parser"
import AppError from '../utils/error.utils.js';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto'


const cookieOptions={
    maxAge: 7*24*60*60*1000,  //7 days
    httpOnly:true,
    secure:true
}


/**
 * @REGISTER
 * @ROUTE @POST {{URL}}/api/v1/user/register
 * @ACCESS Public
 */


const register =async (req,res,next)=>{
    const {fullName,email,password}= req.body;

    if(!fullName || !email || !password){
      //--------------------------------yha bar bar alag alag code likhte the phle hmlog ki ye na rhe to status code ye do vo do usse acha h ek jgah likh di aur usme bs messgae and status code send krte jae vo baki ka chiz smbhale isliye hum middleware bnaenge jo ki hoga "error.middleware.js"
       return next(new AppError('All fields are required',400));  //iss code m next likhe h mtlb yha agar jaise hi error aae to next m chla jae to next m app.js file m jaega niche code m

      //------------------------yha se jo v statusCode aur message vejnge vo "error.utils.js" m pas jaega lekin vha bs app error ka instance show hoga isliye ek middle ware hum bna rhe h"error.middleware.js" isi m jaega tb error print hoga
    }

    // agar user exist ni krta h to new account create krenge phle direct save kr dete the lekin ab two steps m save krenge phle user ka basic chiz name,email save kr denge datbase m uske bad user ka profile third party app se profile upload krbvaenge jb upload ho jaega to finally dobara se save krvaenge
    


    const userExist = await User.findOne({ email });
        
        if (userExist) {
            return next (new AppError('email already exist',409))
        }    
        





    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:
            'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',        },
    });
    
    if(!user){
        return next(new AppError('user registration failed,please try again',400))
    }
    


    //profile pic uploading

    //these below code run only when user uploaded a file yha hume profile  avatar ki file multer.middleware.js se milega 

    // console.log('file details >', JSON.stringify(req.file));
    if (req.file) {
        // console.log(req.file);   // to see file in our console
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'LMS-project-backend', //cloudinary m 'LMS-project-backend' file bnega usi m photos save honge
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill'
            });
            if (result) {         //jb file upload ho jaega to yha hum id aur secure URL change kr denge kyuki phle se dummy avatar diye hue h agar koe avatar na dale to dummy vala hi rh jaega
                user.avatar.public_id =result.public_id;
                user.avatar.secure_url = result.secure_url;


                //removing file from server ---because after uploading we remove file from server
                
                // fs.rm(`uploads/ ${req.file.filename}`) 
            }
        } catch (error) {
          return next(
            new AppError(error || 'File not uploaded, please try again', 400)
          );
        }
      }
    

    
    await user.save();  //ab save kr denge user ko
    
  
    //ab user register ho gya to usko vpas se login krne ko to bolenge ni register kiya means vo login ho chuka h iske liye jwt token generate krenge
    const token=await user.generateJWTToken();

    user.password=undefined;
    

    res.cookie('token',token,cookieOptions)
    
    res.status(201).json({
        success: true,
        message:'user registered succesfully',
        user,

    });
};


// -----------------------------------------------------------------------------------------

/**
 * @LOGIN
 * @ROUTE @POST {{URL}}/api/v1/user/login
 * @ACCESS Public
 */



const login =async (req,res,next)=>{

    try {
        const {email,password}=req.body;

        if(!email || !password){
            return next(new AppError('all fields are required',400));
    
        }
        const user = await User.findOne({ email }).select('+password');

        
  // If no user or sent password do not match then send generic response
  if (!(user && (await user.comparePassword(password)))) {
    return next(
      new AppError('Email or Password do not match or user does not exist', 401)
    );
  }
  // Generating a JWT token

        const token= await user.generateJWTToken();
// Setting the password to undefined so it does not get sent in the response

        user.password=undefined;

        res.cookie('token', token ,cookieOptions)
    
        res.status(200).json({
            success:true,
            message:"user logged in succesfully",
            user,
        })
        
    } catch (e) {
        return next(new AppError(e.message,500));
    }

}













// .......................................................................

/**
 * @LOGOUT
 * @ROUTE @POST {{URL}}/api/v1/user/logout
 * @ACCESS Public
 */






const logout = (req,res)=>{

    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"user logged out succesfully"
    })
}






// .......................................................................


/**
 * @LOGGED_IN_USER_DETAILS
 * @ROUTE @GET {{URL}}/api/v1/user/me
 * @ACCESS Private(Logged in users only)
 */






const getprofile =async (req,res)=>{

    try {
        const userId=req.user.id;
        const user=await User.findById(userId);

        res.status(200).json({
            success:true,
            message:'user details',
            user
        })
        
    } catch (error) {
        return next(new AppError('failed to fetch user detail',500))
    }

}
 //-----------------------------------------------------------------------------------------------
/**
 * @FORGOT_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset
 * @ACCESS Public
 */

const forgotPassword= async (req, res,next)=>{
const {email} = req.body;

if (!email) {
    return next(new AppError('email is required', 400));
}

const user = await User.findOne({email});
if (!user) {
    return next(new AppError('email is not registered',400))
}
const resetToken = await user.generatePasswordResetToken();
 
await user.save();

const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

console.log( " aisa hi url jaega email p reset krne k liye password >",resetPasswordUrl);  //ye terminal p print hoga avi .....ab iss url ko hum reset pswrd m access krke pswrd reset krenge

const subject = 'reset password';
const message= `you can reseet your password by clicking <a href=${resetPasswordUrl} target="_blank> reset your password </a> \n if the abovev link does not work then copy paste this link in new tab ${resetPasswordUrl} \n . if you not requested this kindly ignore this`

try{
    await sendEmail(email, subject,message);

    res.status(200).json({
        success: true,
        message:`reset password token has been sent to ${email} successfully`
    })
}
catch(e){
//agar kuch vjah se forget krte time email fat gya email p koe link ni gya to dono ko undefined kr denge
    user.forgotPasswordExpiry=undefined;
    user.forgotPasswordToken=undefined;

    await user.save();  // server to token veja j par email p gya ni h agar dusri bar user try krna chega to server jo token veja h vo 15 min bad hi vejga isliye phle vje gae token ko save kr liye taki use kr ske

    return next(new AppError(e.message || 'Something went wrong, please try again.',500))

}

}

//----------------------------------------------------------------------
/**
 * @RESET_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset/:resetToken
 * @ACCESS Public
 */



 //reset pswrd k liye hum jo hume link mila h params(parameter) m email p uska use krenge yha usko automatic reset/password URL k sath jod denge
const resetpassword= async(req,res,next)=>{

    const {resetToken}=req.params; //sbse phle jo URL(email p jo aya tha) params m mil h vo le lenge

    const{ password}= req.body; //pswrd user dega body se lenge change krne k lye
  
    const forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex') //vps se token ko encrypt krke save krenge

      // Check if password is not there then send response saying password is required

    if (!password) {
        return next(new AppError('Password is required', 400));
      }
    
      console.log(forgotPasswordToken);

        // Checking if token matches in DB and if it is still valid(Not expired)

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry : {$gt:Date.now()} //ab yha check krenge jo forgotpswrd ka token avi se greater h ya nhi h mtlb token ka time h n avi $gt ka mtlb greater
    })


  // If not found or expired send the response
  if (!user) {
        return next(
            new AppError('token is expired or invalid ,please try again',400)
        )
    }
    //agar user ka forgotPasswordToken ya forgotPasswordExpiry   ho to baki ko undefined krke db m save kr denge
    user.password= password;
    user.forgotPasswordToken=undefined;
    user.forgotPasswordExpiry= undefined;


    user.save();

    res.status(200).json({
        success: true,
        message: 'password changed succesfully !'
    })
}

// --------------------------------------------------------------------
//@change password


const changePassword =async (req,res,next)=>{
    const{id}= req.user.id; 

    const {oldPassword ,newPassword}=req.body

    if (!oldPassword || !newPassword) {
        return next (
            new AppError ('all fileds are mandotary', 400)
        )
    }

    const user = await User.findById(id).select('+password');

    if (!user) {
        return next (
            new AppError ('token is invalid or expired , please try again', 400)
        )
    }

    const isPasswordvalid= await user.comparePassword(oldPassword);

    if (!isPasswordvalid) {
        return next(
            new AppError ('invalid old password',400)
        )
    }
    user.password=newPassword;
    await user.save();
    user.password= undefined

    res.status(200).json({
        success: true,
        message: "password changed succesfully !"
    });

}

// -----------------------------------------------------------------------------------

// @update


const updateUser =(req,res)=>{

    const {fullName}=req.body;
    const{id}= req.user.id;   //user ki id hume req.user.id se mil jaegi

}



export {
    register,login,logout,getprofile,forgotPassword,resetpassword,changePassword, updateUser
}