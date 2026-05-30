const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");

// ---------------- SIGNUP ----------------
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ username, email });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listing");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

// ---------------- LOGIN ----------------
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect("/listing");
    }
);

// ---------------- LOGOUT ----------------
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out!");
        res.redirect("/listing");
    });
});

module.exports = router;