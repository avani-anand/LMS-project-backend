import { Router } from "express";
import { createCourse, getAllCourses, getLectureByCourseId, removeCourse, updateCourse } from "../controller/course.controller.js";
import isLoggedIn from "../middleWares/auth.middleware.js";
import upload from "../middleWares/multer.middleware.js";

const router =Router();

// router.get('/',getAllCourses);
// router.get('/:id',getLectureByCourseId);
router.route('/')
.get(getAllCourses) // by writing doing these we can do multiple methods 0n ("/") i can do post request also on it so after using this we get the power to call multiple method at the same route
.post(isLoggedIn, upload.single('thumbnail'), createCourse)


// router.get('/:id')
router.route('/:id')
.get(isLoggedIn, getLectureByCourseId)
.put(isLoggedIn, updateCourse) .delete(isLoggedIn, removeCourse);;    // ye methods id vale route  p isliye bnae kyuki update and remove krte time hume pta hona  chahiye ki konsi course m upadate kr rhe h



export default router;