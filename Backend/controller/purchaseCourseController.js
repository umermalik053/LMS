import Stripe from "stripe";
import dotenv from "dotenv";
import { courseModel } from "../model/courseModel.js";
import { CoursePurchase } from "../model/purchaseCourseModel.js";
import { userModel } from "../model/userModel.js";
import { lectureModel } from "../model/lectureModel.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment
const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
      });
    }

    const newPurchase = new CoursePurchase({
      userId,
      courseId,
      amount: course.coursePrice,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      metadata: {
        userId,
        courseId,
      },
    });

    if (!session.url) {
      return res.status(500).json({
        status: 500,
        message: "Failed to create checkout session",
      });
    }

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      status: 200,
      message: "Checkout session created successfully",
      url: session.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Failed to create checkout session",
    });
  }
};

const stripeWebhook = async (req, res) => {
  let event;
  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_SECRET_KEY;

    const header = stripe.webhooks.generateTestHeaderString({
      secret,
      payload: payloadString,
    });
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Error processing the payment",
    });
  }
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({
          status: 404,
          message: "Purchase not found",
        });
      }
      if (session.amount_total) {
        purchase.amountPaid = session.amount_total / 100;
      }
      purchase.status = "completed";

      if (purchase.courseId && purchase.courseId.lecture.length > 0) {
        await lectureModel.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }
      await purchase.save();
      console.log("Purchase:", purchase);
      console.log("Course ID:", purchase.courseId?._id);
      console.log("User ID:", purchase.userId);

      await userModel.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      await courseModel.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudent: purchase.userId } },
        { new: true }
      );
      return res.status(200).json({
        status: 200,
        message: "Payment completed successfully",
        
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Failed to process the payment",
      });
    }
  }
};

const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.id;
    const course = await courseModel
      .findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lecture" });
    const purchase = await CoursePurchase.findOne({
      courseId,
      userId,
    });
    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Course details fetched successfully",
      course,
      purchase: !!purchase,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Failed to fetch course details",
    });
  }
};

const getAllPurchaseCourses = async (_, res) => {
  try {
    const purchasedCourses = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    if (!purchasedCourses) {
      return res.status(404).json({
        status: 404,
        message: "No purchased courses found",
        purchasedCourses: [],
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Purchased courses fetched successfully",
      purchasedCourses,
    });
  } catch (error) {}
};

export {
  getCourseDetailWithPurchaseStatus,
  getAllPurchaseCourses,
  createCheckoutSession,
  stripeWebhook,
};
