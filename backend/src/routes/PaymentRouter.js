const express = require('express');
const router = express.Router();
const User = require('../schema/UserModel.js');
const paypalClient= require('../payment/paypalClient');
const paypal = require("@paypal/checkout-server-sdk");

router.post("/create-order", async (req, res) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: "10.00" } }],
    });

    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PayPal order creation failed" });
  }
});

router.post("/capture-order", async (req, res) => {
  const { orderId } = req.body;
  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const capture = await paypalClient.execute(request);

    if (capture.result.status === "COMPLETED") {
      const user = await User.findById(req.userId);
      user.tier = "pro";
      await user.save();
      return res.json({ success: true, message: "Payment completed, upgraded to Pro!" });
    }

    res.status(400).json({ error: "Payment not completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PayPal capture failed" });
  }
});

module.exports = router;