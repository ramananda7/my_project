const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path=require("path"); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/" , (req,res) =>{
    res.send("hii i am root");
});
app.use("/users",users);
app.use("/posts",posts);
app.use(session({
    secret: "vsubububsnkd",
    resave : false,
     saveUninitialized : true,
   })
);
app.use(flash());


app.get("/reqcount" , (req,res )=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`${req.session.count} you comes this page . `);
});
app.get("/register" , (req,res )=>{
   let {name ="anonomous"} = req.query;
   req.session.name=name;
   req.flash("success" , "user registered success .");
   res.redirect("/hello")
});
app.get("/hello" , (req,res )=>{
  
    res.render("page.ejs",{name : req.session.name , msg:req.flash("success") });
});

app.listen(3000 , ()=>{
    console.log("connecting to 3000");
});