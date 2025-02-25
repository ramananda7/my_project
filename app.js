require("dotenv").config();
// console.log("MongoDB Connection URL:", process.env.ATLASDB_URL);

//2jRc0JIxnt5943eC
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasyc = require("./utils/wrapasyc.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/reviews.js");
const session = require("express-session");
const MongoStore =require("connect-mongo");
const flash = require("connect-flash");
const multer = require('multer');
const upload =multer({dest : 'uploads/'});
// for password
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl =process.env.ATLASDB_URL;

// Set View Engine and Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto: {
    secret: "vsubububsnkd",
    },
    touchAfter: 24*3600,
});
store.on("error",()=>{
  console.log("error on mongo session store " ,err);
})

const var_seesion =session({
  store,
  secret: "vsubububsnkd",
  resave : false,
  saveUninitialized : true,
  cookie:{
    expires : Date.now()+7* 24*60*60*1000,
    maxAge : 7* 24*60*60*1000,
    
  }
 });

app.use(var_seesion);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//using passport create new local and then authenticate them
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const listings = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

// app.get("/pass", async (req, res) => {
// let fakeUser = new User({
//    email: "student@gmail.com",
//    username : "ramananda",
// })
//   let registered_user = await User.register(fakeUser,"raman@3570");
//   res.send(registered_user);
// });

// Home Route
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });
app.use((req,res,next) =>{
   res.locals.success = req.flash("success");
   res.locals.errr = req.flash("error");
   res.locals.currUser = req.user;
   next();
});
app.use("/listings",listings);
app.use("/",userRouter);


app.get("/search", wrapasyc(async (req, res, next) => {
  try {
      const { q } = req.query; // Extract the search query from the request
      const kkk = await Listing.find({ title: q });
    //  const list = await Listing.find({ title: { $regex: q, $options: "i" } }); 

      if (!kkk.length) {
          throw new Error("No listings found");
      }  
      // console.log(list);
      res.render("listing/search.ejs", { kkk });
  } catch (err) {
      next(err);
  }
}));
// Edit Route
app.get("/listings/:id/edit", wrapasyc(async (req, res, next) => {
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

// app.all("*",(req,res,next)=>{
//    next(new ExpressError(404,"error all"));
// })
// Global Error Handler
// app.use((err, req, res, next) => {
// let {statusCode  , message} =err;
//   //res.status(501).send(message);
//   res.render("error.ejs",{message});
// });

// // 404 Not Found Handler
// app.use((req, res) => {
  
//    res.status(404).send("Page not found");
// });

app.post("/listings/:id/reviews", async(req , res)=>{
   let listingg = await Listing.findById(req.params.id);
   let newReview= new Review(req.body.review);
   listingg.reviews.push(newReview);

   await newReview.save();
   await listingg.save();
  
   console.log(req.body.review);
   res.redirect(`/listings/${req.params.id}`);
});

// mongoose.connect(dbUrl)
// .then(() => console.log("Database Connected Successfully"))
// .catch(err => console.error("Database Connection Error:", err));


async function main() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.ATLASDB_URL);

    console.log("Connected to MongoDB Successfully!");
  } catch (err) {
    console.error("Database Connection Error:", err.message);
    process.exit(1); // Exit process on failure
  }
}

main();
// // Server Listener
app.listen(8080, () => {
  console.log("Server is started on port 8080");
});
