import { Router} from "express";
import { allPayments, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubsciption } from "../controller/payment.controller.js";
import { authorizedRoles, isLoggedIn } from "../middleWares/auth.middleware.js";

const router = Router();

router
.route('/razorpay-key')
.get(
    isLoggedIn,
    getRazorpayApiKey 
    );

router
.route('/subscribe')
.post(
    isLoggedIn,
    buySubscription
    )

router
.route('/verify')
.post(
    isLoggedIn,
    verifySubsciption
    )

router
.route('/unsubscribe')
.post(
    isLoggedIn,
    cancelSubscription
    )

router.route('/').get(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    allPayments
    );

export default router;