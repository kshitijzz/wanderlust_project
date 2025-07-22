const express= require("express");
const router= express.Router();
const List = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}= require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })


//index route for get and create listing for post on root route
router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))

//add data
router.get("/add", isLoggedIn,listingController.addnew);

//delete,edit and show route together by router.route
router.route("/:id")
.get(wrapAsync(listingController.showR))
.put(isOwner,upload.single('image'),wrapAsync(listingController.editlisting))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroylisting));

//editRoute
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.rendereditform));

module.exports=router;