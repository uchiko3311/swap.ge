const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const secret = "swap_secret_key";

// REGISTER
router.post("/register", async (req,res)=>{
    try{
        const {username,password} = req.body;

        const exists = await User.findOne({username});
        if(exists) return res.status(400).json({msg:"User exists"});

        const hash = await bcrypt.hash(password,10);

        const user = new User({
            username,
            password: hash
        });

        await user.save();

        res.json({msg:"User created"});
    }catch(err){
        res.status(500).json({msg:"Error"});
    }
});

// LOGIN
router.post("/login", async (req,res)=>{
    try{
        const {username,password} = req.body;

        const user = await User.findOne({username});
        if(!user) return res.status(400).json({msg:"User not found"});

        const ok = await bcrypt.compare(password,user.password);
        if(!ok) return res.status(400).json({msg:"Wrong password"});

        const token = jwt.sign(
            {id:user._id},
            secret,
            {expiresIn:"7d"}
        );

        res.json({token,user});
    }catch(err){
        res.status(500).json({msg:"Error"});
    }
});

module.exports = router;
