import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe("YOUR_SECRET_KEY");

app.use(cors());
app.use(express.json());

app.post("/create-checkout", async (req, res) => {

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "gel",
        product_data: {
          name: "VIP Subscription"
        },
        unit_amount: 200
      },
      quantity: 1
    }],
    mode: "payment",
    success_url: "https://your-site.com",
    cancel_url: "https://your-site.com"
  });

  res.json({ url: session.url });
});

app.listen(3000, () => console.log("Server running"));
