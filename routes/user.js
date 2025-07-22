const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller= require("../controllers/users.js");


//signup 
router.route("/signup")
.get( usercontroller.userform)
.post(usercontroller.adduser )

//login

router.route("/login")
.get(usercontroller.loginform)
.post(saveRedirectUrl,
    passport.authenticate('local',{failureRedirect:"/login",failureFlash:true})
    ,usercontroller.loginguser)

router.get("/logout",usercontroller.logoutuser)
module.exports = router;
