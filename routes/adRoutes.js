const express = require("express");
const router = express.Router();

const Ad = require("../models/Ad");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const secret = "swap_secret_key";

// AUTH MIDDLEWARE
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

// CREATE AD
router.post("/", auth, async (req,res)=>{
    try{
        const user = await User.findById(req.userId);

        const userAds = await Ad.countDocuments({user:user.username});

        const images = req.body.images || [];

        // LIMITS
        if(!user.vip && userAds >= 5){
            return res.status(403).json({msg:"VIP required"});
        }

        if(!user.vip && images.length > 7){
            return res.status(403).json({msg:"Max 7 images"});
        }

        if(user.vip && images.length > 14){
            return res.status(403).json({msg:"Max 14 images"});
        }

        const ad = new Ad({
            title:req.body.title,
            desc:req.body.desc,
            images,
            vip:user.vip,
            user:user.username
        });

        await ad.save();

        res.json(ad);

    }catch(err){
        res.status(500).json({msg:"Error"});
    }
});

// GET ADS
router.get("/", async (req,res)=>{
    const ads = await Ad.find().sort({createdAt:-1});
    res.json(ads);
});

// DELETE AD
router.delete("/:id", auth, async (req,res)=>{
    await Ad.findByIdAndDelete(req.params.id);
    res.json({msg:"Deleted"});
});

module.exports = router;
