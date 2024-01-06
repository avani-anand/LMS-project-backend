import { Router } from "express";
import { getprofile, login, logout, register } from "../controller/user.controller.js";
import isLoggedIn from "../middleWares/auth.middleware.js";

const router = Router();

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)  //isme .get method use krne se ye fayda h ki  agar user url m /logout v krega to logout ho jaega
router.get('/me',isLoggedIn,getprofile)


export default router;














