import Course from "../models/course.model.js";
import AppError from "../utils/error.utils.js";


/**
 * @ALL_COURSES
 * @ROUTE @GET {{URL}}/api/v1/courses
 * @ACCESS Public
 */

const getAllCourses= async function (req,res,next) {


    try {
        const courses = await Course.find({}).select('-lectures') //yha hum -lecture kr rhe h kyuki hume courses hi chahiye lectures ni chahiye

        res.status(200).json({
            success: true,
            message:'all courses',
            courses,
        })
        
    } catch (error) {
        return next(
            new AppError (error.message,500)
        )
        
    }
    
}

const getLectureByCourseId = async function (req,res,next) {

    try {

        const {id}= req.params;

        console.log(id);
        const course = await Course.findById(id);

        console.log(course);
        if (!course) {
            return next(
                new AppError ('invalid course id',400)
            )
    
            
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

export{
    getAllCourses,
    getLectureByCourseId
}