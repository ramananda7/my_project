const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");


router.get("/signup" , (req,res)=>{
    res.render("users/signup.ejs")
});
router.post("/signup",async(req,res) =>{
try{
    let {username , email ,password } =req.body;
    const newUser = new User({email , username});
    const re= await User.register(newUser , password);    
    req.flash("success", "welcome to wanderlust");
    res.redirect("/listings");
}catch(message){
    res.render("error.ejs",{message});
}

 
});
router.get("/login" , (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl ,//it save the url to the local for redirect after login . because the  session reset all its propertes afetr login page.

passport.authenticate("local",{failureRedirect :"/login",failureFlash : true }), 
async(req,res)=>{
   
 try{
      req.flash("success" , " welcome back to wanerlust");
      res.redirect(res.locals.redirectUrl || "/listings");
    }catch(message){
        res.render("error.ejs",{message});
    }
    
});
router.get("/logout" , (req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);

        req.flash("success","you are logout . ");
        res.render("users/login.ejs");
    });
  
});



module.exports = router;