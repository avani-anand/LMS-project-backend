import fs from 'fs/promises';


import User  from "../models/user.model.js";
import cookie from "cookie-parser"
import AppError from '../utils/error.utils.js';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';




const cookieOptions={
    maxAge: 7*24*60*60*1000,  //7 days
    httpOnly:true,
    secure:true
}

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
    


    
    // to do : file upload--------------------------------------------

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

const login =async (req,res,next)=>{

    try {
        const {email,password}=req.body;

        if(!email || !password){
            return next(new AppError('all fields are required',400));
    
        }
        const user=await User.findOne({
            email
        }).select('+password')
        
        if(! user || !user.comparePassword (password)){
            return next (new AppError('email or password does not match ',400))
        }
    
        const token= await user.generateJWTToken();
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



export {
    register,login,logout,getprofile
}