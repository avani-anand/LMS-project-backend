import { Router } from "express";
import { addLectureCourseById, createCourse, getAllCourses, getLectureByCourseId, removeCourse, updateCourse } from "../controller/course.controller.js";
import {isLoggedIn,  authorizedRoles } from "../middleWares/auth.middleware.js";
import upload from "../middleWares/multer.middleware.js";

const router =Router();

// router.get('/',getAllCourses);
// router.get('/:id',getLectureByCourseId);
router.route('/')
.get(getAllCourses) // by writing doing these we can do multiple methods 0n ("/") i can do post request also on it so after using this we get the power to call multiple method at the same route
.post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('thumbnail'), createCourse)


// router.get('/:id')
router.route('/:id')
.get(isLoggedIn, getLectureByCourseId)
.put(isLoggedIn, authorizedRoles('ADMIN'), updateCourse) 
.delete(isLoggedIn, authorizedRoles('ADMIN'), removeCourse)   // ye methods id vale route  p isliye bnae kyuki update and remove krte time hume pta hona  chahiye ki konsi course m upadate kr rhe h
.post(isLoggedIn,authorizedRoles('ADMIN'),upload.single('lecture'), addLectureCourseById);


export default router;