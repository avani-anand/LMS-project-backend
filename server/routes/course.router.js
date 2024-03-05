import { Router } from "express";
import { getAllCourses, getLectureByCourseId } from "../controller/course.controller.js";
import isLoggedIn from "../middleWares/auth.middleware.js";

const router =Router();

// router.get('/',getAllCourses);
// router.get('/:id',getLectureByCourseId);
router.route('/').get(getAllCourses); // by writing doing these we can do multiple methods 0n ("/") i can do post request also on it so after using this we get the power to call multiple method at the same route
router.get('/:id').get(isLoggedIn, getLectureByCourseId);


export default router;