import User  from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import razorpay from "../server.js"


export const getRazorpayApiKey= async (req,res,next)=>{

    try {
        
        res.status(200).json({
            success: true,
            mesage:'razorpay API key',
            key: process.env.RAZORPAY_KEY_ID
        })
    } catch (error) {
        return next(new AppError (error.mesage , 500))
    }
}


export const buySubscription= async (req,res,next)=>{

try {
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

    const subscription=await razorpay.subscriptions.create ({
        paln_id: process.env.RAZORPAY_PLAN_ID,
        customer_notify: 1    //after making subscription customer get notify

    });
//then saving subscription id and status in user inormation
    user.subscription.id=subscription.id;
    user.subscription.status=subscription.status;  //here subscription is only inititated so before payment its subscription is in INITIATED or PENDING status after doing payment then its status is became ACTIVE

    await user.save()

    res.status(200).json({
        success: true,
        message:'subscribed succesfully',
        subscription_id:subscription.id
    })

} catch (error) {
    return next(new AppError (error.mesage , 500))
}

}



export const verifySubsciption= async (req,res,next)=>{

    try {
        const {id}=req.user;
        const{razorpay_payment_id,razorpay_signature,razorpay_subscription_id}=req.body;
    
        const user = await User.findById(id);
        if (!user) {
            return next(
                new  AppError('unauthorized , please login')
            )
        }
    
        const subscriptionId=user.subscription.id;
    
        const generatedSignature=crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id} | ${subscriptionId}`)
            .digest('hex');
    
         if (generatedSignature !== razorpay_signature) {
            return next(
                new AppError('payment not verified, please try again',500)
            )
         }   
    
    
         await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id,
         });
    
    
         user.subscription.status='active';
         await user.save();
    
    
         res.status(200).json({
            success: true,
            message: 'payment verified successfully!'
         })
    
    
    } catch (error) {
        
    }

    
}
export const cancelSubscription= async (req,res,next)=>{
    
}
export const allPayments= async (req,res,next)=>{
    
}
