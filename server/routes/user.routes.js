import { Router } from "express";
import { getprofile, login, logout, register } from "../controller/user.controller";

const router = Router();

router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)  //isme .get method use krne se ye fayda h ki  agar user url m /logout v krega to logout ho jaega
router.get('/me',getprofile)


export default router;














