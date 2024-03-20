import User  from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import razorpay from '';


export const getRazorpayApiKey= async (req,res,next)=>{
    res.status(200).json({
        success: true,
        mesage:'razorpay API key',
        key: process.env.RAZORPAY_KEY_ID
    })
}
export const buySubscription= async (req,res,next)=>{
    const {id}=req.user;
    const user = await User.findById(id);

    if(!user){
        return next(
            new AppError(' unauthorized , please login')
        )
    }

    if (user.role === 'ADMIN') {
        return next(
            new AppError(
                'admin cannot purchase a subscription',400
            )
        )
    }


}
export const verifySubsciption= async (req,res,next)=>{
    
}
export const cancelSubscription= async (req,res,next)=>{
    
}
export const allPayments= async (req,res,next)=>{
    
}
