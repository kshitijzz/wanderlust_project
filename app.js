if(process.env.NODE_ENV!= "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const List = require("./models/listing.js")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");




const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//url to atlas db
 const dburl= process.env.ATLASDB_URL;


const store= MongoStore.create(
    {mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET_SESSION_KEY,
    },
    touchAfter:24* 3600,
});

store.on("error",()=>{
    console.log("error in mongo session store",err);
})

app.use(session({
    store:store,
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
}));



app.use(flash());//pehle flash aaega phir uske baad routes aaenge

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware for the flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    res.locals.currentuser=req.user;
    next();
})




const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));


app.engine('ejs', ejsMate);
//connectiong to mongoDB
async function main() {
   
    await mongoose.connect(dburl);
}
main()
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log("not connected to database");
    })
//home route

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
    let { status = 500, message = "some error occured" } = err;
    res.render("error.ejs", { status, message });

})

app.listen(3000, () => {
    console.log("server is running");
})