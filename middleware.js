const Listing = require("./models/listings.js");
module.exports.isLoggedIn = (req,res ,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl =req.originalUrl;
        req.flash("success","you must login");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl = (req,res ,next ) =>{
  if( req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
  }

  if (!listing.Owner.equals(req.user._id)) { // Ensure `Owner` is an ObjectId
      req.flash("error", "You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
  }

  next();
};
