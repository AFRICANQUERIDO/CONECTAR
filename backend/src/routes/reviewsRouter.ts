import { Router } from "express";
import { calculateGigAverageRatings, createReview,getAllReviews,getReviewsByOrderStatus, userReview } from "../controllers/ReviewsController";


const reviewRouter = Router()

reviewRouter.post('/', createReview)
reviewRouter.get('/status/:status', getReviewsByOrderStatus)
reviewRouter.get('/', getAllReviews)
reviewRouter.get('/gig/rating', calculateGigAverageRatings)
reviewRouter.get('/user/:userID', userReview)

export default reviewRouter
