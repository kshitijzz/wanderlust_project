if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Atlas DB URL
const dburl = process.env.ATLASDB_URL;

// Session Configuration
app.use(session({
    secret: process.env.SECRET_SESSION_KEY || "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
}));

app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentuser = req.user;
    next();
});

// MongoDB Connection
async function main() {
    await mongoose.connect(dburl);
}

main()
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log("not connected to database");
        console.log(err);
    });

// Home Route
app.get("/", (req, res) => {
    res.redirect("/listing");
});

// Routes
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Error Handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let { status = 500, message = "Some error occurred" } = err;

    res.status(status).render("error.ejs", {
        status,
        message
    });
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("server is running");
});