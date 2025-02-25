const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapasyc = require("../utils/wrapasyc.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");



router.post("/", async(req , res)=>{
    let listingg = await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    listingg.reviews.push(newReview);
 
    await newReview.save();
    await listingg.save();
   
    console.log(req.body.review);
    res.redirect(`/listings/${req.params.id}`);
 });
 

 module.exports = router;