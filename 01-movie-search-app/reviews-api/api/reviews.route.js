import express from "express";
import ReviewsController from "./reviews.controller.js";

const router = express.Router();

// router.route("/").get((req, res) => res.send("hello world"));
router.route("/movie/:id").get(ReviewsController.apiGetReviews);
router.route("/new").post(ReviewsController.apiPostReview);
router.route("/:id")
    .get(ReviewsController.apiGetReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview);

export default router;