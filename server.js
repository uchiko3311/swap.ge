const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/swapge")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// ================= MODELS =================

// USER
const User = mongoose.model("User", {
    username: String,
    password: String,
    vip: { type: Boolean, default: false }
});

// AD
const Ad = mongoose.model("Ad", {
    title: String,
    desc: String,
    images: [String],
    vip: { type: Boolean, default: false },
    user: String,
    createdAt: { type: Date, default: Date.now }
});

// ================= AUTH =================
const secret = "swap_secret_key";

// REGISTER
app.post("/register", async (req,res)=>{
    const {username,password} = req.body;

    const hash = await bcrypt.hash(password,10);

    const user = new User({
        username,
        password: hash
    });

    await user.save();
    res.json({msg:"User created"});
});

// LOGIN
app.post("/login", async (req,res)=>{
    const {username,password} = req.body;

    const user = await User.findOne({username});

    if(!user) return res.status(400).json({msg:"User not found"});

    const ok = await bcrypt.compare(password,user.password);

    if(!ok) return res.status(400).json({msg:"Wrong password"});

    const token = jwt.sign({id:user._id}, secret);

    res.json({token,user});
});

// ================= MIDDLEWARE =================
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

// ================= ADS =================

// CREATE AD
app.post("/ads", auth, async (req,res)=>{

    const user = await User.findById(req.userId);

    const userAdsCount = await Ad.countDocuments({user:user.username});

    // VIP LIMIT
    if(!user.vip && userAdsCount >= 5){
        return res.status(403).json({msg:"VIP required"});
    }

    const images = req.body.images || [];

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
});

// GET ADS
app.get("/ads", async (req,res)=>{
    const ads = await Ad.find().sort({createdAt:-1});
    res.json(ads);
});

// DELETE AD
app.delete("/ads/:id", auth, async (req,res)=>{
    await Ad.findByIdAndDelete(req.params.id);
    res.json({msg:"Deleted"});
});

// ================= AUTO DELETE (30 DAYS) =================
setInterval(async ()=>{
    const limit = new Date();
    limit.setDate(limit.getDate() - 30);

    await Ad.deleteMany({ createdAt: { $lt: limit } });

    console.log("Old ads cleaned");
}, 86400000);

// ================= VIP UPGRADE (MOCK PAYMENT) =================
app.post("/vip", auth, async (req,res)=>{
    await User.findByIdAndUpdate(req.userId,{vip:true});
    res.json({msg:"VIP activated"});
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log("Server running on port " + PORT);
});
