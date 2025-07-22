const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review= require("../models/review.js");
const List = require("../models/listing.js")
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")
//Reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createreviews))

//delete reviews route
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deletereviews))

module.exports=router;