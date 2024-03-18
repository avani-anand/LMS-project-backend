import mongoose from "mongoose";
import {model,Schema} from mongoose

const paymentSchema = new Schema({
    razorpay_payment_id:{
        type:String,
        require:true
    },
    razorpay_subsciption_id:{
        type: String,
        require: true,
    },
    razorpay_signature:{
        type : String,
        require: true
    }
},{timestamps: true})