const User = require("../models/User");

async function vipMiddleware(req, res, next){

    try{
        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({msg:"User not found"});
        }

        if(!user.vip){
            return res.status(403).json({msg:"VIP required"});
        }

        next();

    }catch(err){
        res.status(500).json({msg:"Server error"});
    }
}

module.exports = vipMiddleware;
