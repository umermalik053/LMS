import express from 'express';
import isAuthenticated from '../middleWare/isAuthenticated.js';
import { createCheckoutSession, getAllPurchaseCourses, getCourseDetailWithPurchaseStatus, stripeWebhook } from '../controller/purchaseCourseController.js';

const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession)
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus)
router.route("/").get(getAllPurchaseCourses)
router.route("/webhook").post(express.raw({type: 'application/json'}),stripeWebhook)

export default router;