const mongoose= require("mongoose");
const initdata = require("./data.js");
const List=require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log("not connected to database");
})

const initDb=async()=>{
    await List.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner: '68440a75e5d8f70b2ffbc682'}))
    await List.insertMany(initdata.data);
    console.log("data was initialized");
}
initDb();