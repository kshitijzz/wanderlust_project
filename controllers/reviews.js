const Review= require("../models/review");
const List=require("../models/listing");

module.exports.createreviews=async(req,res)=>{
    const {id}= req.params;
    let listing=await List.findById(id);
    let newReview= new Review(req.body.review);
    newReview.author= req.user._id;//if user isloggedin
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(listing);
    console.log("new review saved");
    req.flash("success","New Review added");
    res.redirect(`/listing/${listing._id}`);
};

module.exports.deletereviews=async(req,res)=>{
    let{id,reviewid}=req.params;
    await List.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listing/${id}`)
};