import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-payment", async (req, res) => {

  const { uid, amount } = req.body;

  // აქ უნდა იყოს Bank API
  // Bank of Georgia integration
  // (merchant token required)

  res.json({
    url: "https://bank-payment-page.com/session123"
  });
});

app.listen(3000, () => console.log("Server running"));
