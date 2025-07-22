const User = require("../models/user.js");

module.exports.userform=(req, res) => {
    res.render("users/signup.ejs");
};

module.exports.adduser=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        let registeredUser = await User.register(newuser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
              return next(err);
            }
        req.flash("success", "welcome to wanderlust");
        res.redirect("/listing");  
        })
    } catch (e) {
          req.flash("error",e.message);
          res.redirect("/signup");
    }
}

module.exports.loginform=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginguser=async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
   
    res.redirect(res.locals.redirectUrl || "/listing");
    
};



module.exports.logoutuser=(req,res,next)=>{
    req.logout((err)=>{
         if(err){
           return next(err);
         }
         req.flash("success","you loged out");
         res.redirect("/listing");
    });
};