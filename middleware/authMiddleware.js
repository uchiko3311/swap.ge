const jwt = require("jsonwebtoken");

const secret = "swap_secret_key";

function authMiddleware(req, res, next){

    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({msg:"No token provided"});
    }

    try{
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        next();
    }catch(err){
        return res.status(401).json({msg:"Invalid token"});
    }
}

module.exports = authMiddleware;
