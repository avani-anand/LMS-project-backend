import { Router } from "express";
import { changePassword,forgotPassword, getprofile, login, logout, register, resetpassword, updateUser } from "../controller/user.controller.js";
import isLoggedIn from "../middleWares/auth.middleware.js";
import upload from "../middleWares/multer.middleware.js";

const router = Router();

router.post('/register',upload.single("avatar"),register) // register route p jane se phle upload file m jae aur ".single" ka mtlb h single file upload ho "avatar" is data key  mtlb  avatar name ki file upload hogi
router.post('/login',login)
router.get('/logout',logout)  //isme .get method use krne se ye fayda h ki  agar user url m /logout v krega to logout ho jaega
router.get('/me',isLoggedIn,getprofile);
router.post('/reset',forgotPassword);
router.post("/reset/:resetToken",resetpassword);
router.post('/change-password',isLoggedIn,changePassword);
router.put('/update/:id',isLoggedIn,upload.single("avatar"),updateUser); //put method is used for update

export default router;














