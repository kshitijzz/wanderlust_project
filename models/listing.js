 const mongoose = require("mongoose");
const Review = require("./review");
 
const listSchema = mongoose.Schema({
  title: String,
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1567950171851-1feb54bdb5b2?w=1000&auto=format&fit=crop&q=60"
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});

listSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
 await Review.deleteMany({_id:{$in:listing.reviews}});
  }
    
})

 const List=new mongoose.model("List",listSchema);

 module.exports=List;