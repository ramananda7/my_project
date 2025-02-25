const express = require("express");
const router = express.Router();
const wrapasyc = require("../utils/wrapasyc.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const mongoose = require("mongoose");
const {isLoggedIn} = require("../middleware.js");
const listing_controller =require("../controllers/listings.js");
const multer = require("multer");
const {storage} =require("../cloudConfig.js");
const upload = multer({storage});

router.route("/").
get( wrapasyc(listing_controller.index)).
post(upload.single("listing[image]"), listing_controller.update);


// New Listing Form
router.get("/new",isLoggedIn, (req, res) => {
  return res.render("listing/new.ejs");
});  


// Show Route
router.get("/:id", wrapasyc(async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Listing ID.");
        return res.redirect("/listings");
    }
      const list = await Listing.findById(id).populate("reviews").populate("Owner");    
      if (!list) {
        req.flash("error","no object is their . ");
       
        return res.redirect("/listings");
      }
      res.render("listing/show.ejs", { list });
    } catch (err) {
      next(err);
    }
  }));

router.put("/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  });
    // Delete Route
router.delete("/:id",wrapasyc( async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      throw new Error("Listing not found");
    }
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
}));

 // Edit Route
router.get("/:id/edit", wrapasyc(async (req, res, next) => {
    try {
      const { id } = req.params;
      const listt = await Listing.findById(id);
      if (!listt) {
        throw new Error("Listing not found");
      }
      res.render("listing/edit.ejs", { listt });
    } catch (err) {
      next(err);
    }
  }));
  


module.exports = router;


// router.get("/:id", wrapasyc(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const list = await Listing.findById(id).populate("reviews");    if (!list) {
//       throw new Error("Listing not found");
//     }
//     res.render("listing/show.ejs", { list });
//   } catch (err) {
//     next(err);
//   }
// }));