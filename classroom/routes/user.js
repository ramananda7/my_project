const express = require("express");
const router = express.Router();


router.get("/" , (req,res )=>{
    res.send("get for user");
});
router.get("/:id" , (req,res )=>{
    res.send("get for show user");
});
router.post("/" , (req,res )=>{
    res.send("post for user");
});
router.post("/:id" , (req,res )=>{
    res.send("post for show user");
});
router.delete("/:id" , (req,res )=>{
    res.send("delete for  user id ");
});

module.exports=router;