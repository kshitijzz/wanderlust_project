if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

// Routes
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ENV
const dburl = process.env.ATLASDB_URL;
const SECRET = process.env.SECRET_SESSION_KEY;

// -------------------- DB CONNECTION --------------------
async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("connected to database");
    } catch (err) {
        console.log("DB connection error:", err);
    }
}

main();

// -------------------- SESSION STORE --------------------
const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR:", err);
});

// -------------------- SESSION CONFIG --------------------
app.use(
    session({
        store: store,
        secret: SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
            maxAge: 1000 * 60 * 60 * 24 * 3,
            httpOnly: true,
        },
    })
);

// -------------------- PASSPORT --------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------- VIEW ENGINE --------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// -------------------- MIDDLEWARE --------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(flash());

// Make data available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentuser = req.user || null;
    next();
});

// -------------------- ROUTES --------------------
app.get("/", (req, res) => {
    res.redirect("/listing");
});

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    let status = err.status || 500;
    let message = err.message || "Something went wrong";

    res.status(status).render("error.ejs", { status, message });
});

// -------------------- GLOBAL CRASH HANDLERS --------------------
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err);
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("server is running on port", PORT);
});