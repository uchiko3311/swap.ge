const authMiddleware = require("./middleware/authMiddleware");
const vipMiddleware = require("./middleware/vipMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

// example route protection
app.post("/ads", authMiddleware, (req,res)=>{
    res.json({msg:"Protected route"});
});

// VIP route example
app.post("/vip-content", authMiddleware, vipMiddleware, (req,res)=>{
    res.json({msg:"VIP access granted"});
});

// error handler (ALWAYS LAST)
app.use(errorMiddleware);
