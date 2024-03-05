import {Schema, model} from "mongoose";

const courseSchema= new Schema({
    title:{
        type:String,
        required:[true, 'title is required'],
        minLenghth:[8,'title must be atleast 8 characters'],
        maxLength:[59,'title should be less than 60 char'],
        trim:true,
    },
    description:{
        type:String,
        required:[true, 'desciption is required'],
        minLenghth:[8,'desciption must be atleast 8 characters'],
        maxLength:[200,'desciption should be less than 200 char'],


    },
    category:{
        type:String,
        required: [true,'category is required']
    },
    thumbnail :{
        public_id:{
            type:String,
            required:true,
        },
        secure_url:{
            type:String,

            required:true,
            
        }

    },
    lectures: {
        title:String,
        description: String,
        lecture: {

            public_id:{
                type:String,
                required:true,
            },
            secure_url:{
                type:String,
                required:true,

            }
        }

    },
    numberOfLectures:{
        type:Number,
        default:0,
    },
    createdBy:{
        type:String,
        required:true
    } 
}
,{timestamps:true})

const Course=model('Course', courseSchema)

export default Course;