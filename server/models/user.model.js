import mongoose, { Schema,model } from 'mongoose';
import bcrypt from "bcryptjs"
import  Jwt  from "jsonwebtoken";
import crypto from 'crypto';


const userSchema = new Schema({

    fullName:{
        type:String,
        require: [true,'name is required'],
        minLenght :[5,'name must be 5 char'],
        maxLenght :[10,'name less than  10 char'],
        lowercas:true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please fill in a valid email address',
        ], // Matches email against regex
      },
          password:{
        type:'String',
        require: [true,'password is required'],
        minLenght :[8,'password must be at least 8 char'],
        select: false,
    },
    avatar:{
        public_id:{
            type:'String'
        },
        secure_url:{
            type:'String'
        }
    },
    role:{
        type:'String',
        enum:['USER','ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry:Date

},{timestamps:true});



//yha bta rhe h ki user details save hone se phle ye function run ho aur iss function m hum pswrd ko hash pswrd m change krenge
userSchema.pre('save',async function(next){
    if (!this.isModified('password')) 
        return next();
    
    this.password=await bcrypt.hash(this.password,10)
    return next();
});


userSchema.methods={
    generateJWTToken:async function(){
        return Jwt.sign(

            { id: this._id, email: this.email, subscription: this.subscription, role: this.role },
            process.env.JWT_SECRET, // error coming from here
            { expiresIn: process.env.JWT_EXPIRY }
        );
    },

    comparePassword:async function(plainTextPassword){

        return await bcrypt.compare(plainTextPassword,this.password)
    },

    generatePasswordResetToken : async function(){
        const resetToken= crypto.randomBytes(20).toString('hex');    //ye sb predefined methods h jo ki reset pswrd k liye use hote h yha hum 20 bytes ka token bnanege 
    
        this.forgotPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex'); //   encrypt krne k liye createHash('sha256') ye algorithm use kiye h  aur update krne k liye "update(resetToken) " use kiye h         //yha hmlog direct "resetToken" aise v likh denge to pswrd reset ho jaega par hum crptyo se encrypt kreke dalenge
        this.forgotPasswordExpiry= Date.now()+15*60*1000; // 15 min from now
    
        return resetToken ;  //hume url m ye vala vejna h encryption vala ni vejna h isliye "resetToken "return kr rhe h encrypted bad m use krenge
      }


    }





const User=mongoose. model('User',userSchema)       // mongoose.       changing here

export default User;