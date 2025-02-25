const Listing = require("../models/listings.js");


module.exports.index = async (req, res, next) => {
    try {
      const allListings = await Listing.find({});
      //const msg = req.flash("success");
      res.render("listing/index.ejs", { allListings });
    } catch (err) {
      next(err); // Pass error to error handler
    }
  }

  module.exports.update = async (req, res, next) => { 
    // if(!req.body.listing)throw new ExpressError(400,"send valid data");
     let url = req.file.path;
     let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     newListing.Owner =  req.user._id;
     newListing.image =  {filename ,url } ;
     await newListing.save();
     req.flash("success","new listing created");
     res.redirect("/listings");
   }
