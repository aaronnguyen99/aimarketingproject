// UpgradeButton.jsx
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import api from "../services/api";

export default function UpgradeButton() {
  const createOrder = async () => {
    const { data } = await api.post("/payment/create-order", {});
    console.log("data",data);
    return data.id;
  };

  const onApprove = async (data) => {
    try {
      const { data: captureData } = await api.post("/payment/capture-order", {
        orderId: data.orderID,
      });

      alert(captureData.message);
      window.location.reload(); // refresh to show updated tier
    } catch (err) {
      alert(err.response?.data?.error || "Payment failed");
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
      />
    </PayPalScriptProvider>
  );
}