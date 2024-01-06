import { Schema,model } from 'mongoose';
import bcrypt from "bcryptjs"
import  Jwt  from "jsonwebtoken";


const userSchema = new Schema({

    fullName:{
        type:'String',
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



//yha bta rhe h kiuser details save hone se phle ye function run ho aur iss function m hum pswrd ko hash pswrd m change krenge
userSchema.pre('save',async function(next){
    if (!this.isModified('password')) {
        return next();
    }
    this.password=await bcrypt.hash(this.password,10)
});


userSchema.methods={
    generateJWTToken:async function(){
        return await Jwt.sign(

            {id:this._id, email:this.email, subscription:this.subscription ,role: this.role},
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRY,
            }
            )
    },

    comparePassword:async function(plainTextPassword){

        return await bcrypt.compare(plainTextPassword,this.password)
    }

}



const User=model('User',userSchema)

export default User;