import { Router} from "express";
import { allPayments, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubsciption } from "../controller/payment.controller.js";

const router = Router();

router.route('/razorpay-key').get(getRazorpayApiKey);

router.route('/subscribe').post(buySubscription)

router.route('/verify').post(verifySubsciption)

router.route('/unsubscribe').post(cancelSubscription)

router.route('/').get(allPayments);

export default router;