const express = require("express");
const router = express.Router();

router.get("/" , (req,res )=>{
    res.send("get for posts");
});
router.get("/:id" , (req,res )=>{
    res.send("get for show posts");
});
router.post("/" , (req,res )=>{
    res.send("post for posts");
});
router.post("/:id" , (req,res )=>{
    res.send("post for show posts");
});
router.delete("/:id" , (req,res )=>{
    res.send("delete for  posts id ");
});

module.exports=router;