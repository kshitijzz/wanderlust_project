const List=require("../models/listing")
const { cloudinary } = require("../cloudConfig");


module.exports.index=async (req, res) => {
    const allListings = await List.find();
    res.render("listings/view", { allListings });
};

module.exports.addnew=(req, res) => {
    res.render("listings/add");
};

module.exports.showR=async (req, res) => {
    let { id } = req.params;
    const allListings = await List.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})//nested populate
    .populate("owner");
    console.log(allListings);
    if(!allListings){
        req.flash("error","Listing you requested does not exists!");
        return res.redirect("/listing");
    }
    res.render("listings/show", { allListings: allListings });
};

module.exports.createListing=async (req, res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url," ",filename);
    let newListing = new List(req.body.listing);
    newListing.owner=req.user.id;//current user hi owner ban jaega 
    newListing.image={url,filename};
    await newListing.save();

    req.flash("success", "New Listing Added");
    res.redirect("/listing");
};

module.exports.rendereditform=async (req, res) => {
    const { id } = req.params;
    const data = await List.findById(id);
     if(!data){
        req.flash("error","Listing you requested does not exists!");
        return res.redirect("/listing");
    }
    let originalImageUrl=data.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit", { data });
};

module.exports.editlisting=async (req, res) => {
   const { id } = req.params;
    const existingListing = await List.findById(id);

    if (!existingListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }
   const { title, description, price, location, country } = req.body;

    // Default to existing image unless a new one is uploaded
    let updatedImage = existingListing.image;

    if (req.file) {
        // Optional: Delete old image from Cloudinary (if not a default image)
        if (existingListing.image?.filename && existingListing.image.filename !== "default") {
            await cloudinary.uploader.destroy(existingListing.image.filename);
        }

        updatedImage = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    const updatedData = {
        title,
        description,
        image: updatedImage,
        price,
        location,
        country
    };

    await List.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    req.flash("success","listing updated");
    res.redirect("/listing");
};

module.exports.destroylisting=async (req, res) => {
    const { id } = req.params;
    const dataDeleted = await List.findByIdAndDelete(id);
    console.log(dataDeleted);
    req.flash("success","listing deleted");
    
    res.redirect("/listing");

};