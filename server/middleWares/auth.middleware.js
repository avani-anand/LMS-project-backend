// jb hum get profile k liye jaenge to vha id ka use kiye h hmlog to id hmlog vha yhi se le jaenge kyuki koe getprofile p click kiya h mtlb user phle se login h tb hi n kia hoga to user k token se uska id nikal kr information de DocumentFragment

import AppError from "../utils/error.utils.js";
import jwt from 'jsonwebtoken'

const isLoggedIn=async(req,res,next)=>{
    const {token}= req.cookies;

    if(!token){
        return next ( new AppError('unauthenticated,please login again',403));
       
    }

    const userDetails=await jwt.verify(token,process.env.JWT_SECRET);

    req.user=userDetails;
    next();

}

export default isLoggedIn;
