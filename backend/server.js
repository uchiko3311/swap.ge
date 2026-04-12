const express = require("express");
const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
res.send("Swap.ge backend running");
});

app.listen(3000,()=>{
console.log("Server running");
});
