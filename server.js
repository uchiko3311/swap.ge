const authRoutes = require("./routes/authRoutes");
const adRoutes = require("./routes/adRoutes");
const vipRoutes = require("./routes/vipRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/vip", vipRoutes);
