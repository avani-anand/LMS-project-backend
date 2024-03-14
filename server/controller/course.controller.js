import Course from "../models/course.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary"
import fs from 'fs/promises';
import path  from "path";

/**
 * @ALL_COURSES
 * @ROUTE @GET {{URL}}/api/v1/courses
 * @ACCESS Public
 */

const getAllCourses= async function (req,res,next) {


    try {
        const courses = await Course.find({}).select('-lectures') //yha hum "-lecture " kr rhe h kyuki hume courses hi chahiye lectures ni chahiye

        res.status(200).json({
            success: true,
            message:'all courses',
            courses,
        })
        
    } catch (error) {
        return next(
            new AppError (error.message,500)
        )}
}

// -----------------------------------------------------------------------------------------------

/**
 * @GET_LECTURES_BY_COURSE_ID
 * @ROUTE @POST {{URL}}/api/v1/courses/:id
 * @ACCESS Private(ADMIN, subscribed users only)
 */




const getLectureByCourseId = async function (req,res,next) {

    try {

        const {id}= req.params;

        console.log(id);
        const course = await Course.findById(id);

        console.log(course);
        if (!course)
         {
            return next( new AppError ('invalid course id',400)  )
         }
        res.status(200).json({
            success: true,
            message:' course lectures fetched succesfully',
            lectures: course.lectures,
        })      
        } catch (error) {
        return next(
            new AppError (error.message,500)
        )
        
    }
    
}


// @course creating   ---------------------------------------------------------------------------------------------------------------------
/**
 * @CREATE_COURSES
 * @ROUTE @POST {{URL}}/api/v1/courses
 * @ACCESS private( admin only)
 */

const  createCourse = async(req,res,next)=>{


    const {title,description,category,createdBy }=req.body;


    if (!title || !description ||!category || !createdBy) {
        return next(
            new AppError('all fileds are required', 400)
        )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{
            public_id:"ahasdhkasdhdjhgfuweyiewyuiiywui",
            secure_url : 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        },
    })

//if course is not created then
    if (! course) {
        return next(
            new AppError('course could not created , please try again', 500)
        )
    }
// for uploading course banner
    if (req.file) {


        try {
            
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder : 'LMS-project-backend', //cloudinary m 'LMS-project-backend' file bnega usi m photos save honge
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill'
    
            })

            // console.log(JSON.stringify(result))    //printing the result to see in terminal
    // after uploading file in thumbnail we updating it in result
            if (result) {
                course.thumbnail.public_id=result.public_id;
                course.thumbnail.public_id=result.secure_url;
                
            }
         // then removing the file  from our local file uploads
            // fs.rm(`uploads / ${req.file.filename}`);
        }
        catch (error) {
        return next(new AppError(error.message, 500))

        
        }
    }
        await course.save();
    
        res.status(200).json({
            succes:true,
            message:'course created successfully',
            course
        });


}
// ------------------------------------------------------------------------------------------------------------------

/**
 * @UPDATE_COURSES_BY_ID
 * @ROUTE @POST {{URL}}/api/v1/courses/:id
 * @ACCESS private( admin only)
 */


const updateCourse = async(req,res,next)=>{

try {
    const {id}= req.params;

    const course =await Course.findByIdAndUpdate(        //"findByIdAndUpdate" iss method se hum id se dudh kr aur update krenge
        id,
          {
             $set:req.body  //means jo v req.body se mil rha h use override update kr do
          },
          {

            //this check validation that new data coming is right or not it check validation through our model of course
            runValidators:true


          }
    );
    if (!course) {
        return next('course with given id does not exist',500)
    }
    
    res.status(200).json({
        succes: true,
        message:'course updated succesfully ........',
        Course
    })
    
} catch (e) {
    return next(new AppError(e.message,500))
}



}




const removeCourse = async(req,res,next)=>{

}







export{
    getAllCourses,
    getLectureByCourseId,
    createCourse,
    updateCourse,
    removeCourse
}