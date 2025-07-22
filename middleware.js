const List=require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn= (req,res,next)=>{
   //   console.log(req.path,"-",req.originalUrl);
     if(!req.isAuthenticated()){
      //redirectUr
      req.session.redirectUrl=req.originalUrl;
      req.flash("error","you must be logged in!");
      return res.redirect("/login");
   }
   next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl;
   }
   next();
}

//for authorization
module.exports.isOwner=async (req,res,next)=>{
      const { id } = req.params;
      let listing=await List.findById(id);
      if(!listing.owner.equals(res.locals.currentuser._id)){
        req.flash("error","you don't have permission ");
        return res.redirect(`/listing/${id}`)
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
   
    if(error){
        throw new ExpressError(400,error)
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
   
    if(error){
        throw new ExpressError(400,error)
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
      const { id,reviewid} = req.params;
      let review=await Review.findById(reviewid);
      if(!review.author.equals(res.locals.currentuser._id)){
        req.flash("error","you don't have permission");
        return res.redirect(`/listing/${id}`)
    }
    next()
}