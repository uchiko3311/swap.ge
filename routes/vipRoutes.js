const express = require("express");
const router = express.Router();

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const secret = "swap_secret_key";

// AUTH
function auth(req,res,next){
    const token = req.headers.authorization;

    if(!token) return res.status(401).json({msg:"No token"});

    try{
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        next();
    }catch(err){
        res.status(401).json({msg:"Invalid token"});
    }
}

// UPGRADE VIP (mock payment)
router.post("/", auth, async (req,res)=>{
    await User.findByIdAndUpdate(req.userId,{
        vip:true
    });

    res.json({msg:"VIP activated"});
});

module.exports = router;
