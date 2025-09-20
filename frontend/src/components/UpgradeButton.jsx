// UpgradeButton.jsx
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

export default function UpgradeButton({ token }) {
const backendUrl=import.meta.env.VITE_BACKEND_URL
  const createOrder = async () => {
    const { data } = await axios.post(backendUrl+"/payment/create-order", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("data",data);
    return data.id;
  };

  const onApprove = async (data) => {
    try {
      const { data: captureData } = await axios.post(backendUrl+"/payment/capture-order", {
        orderId: data.orderID,
      }, { headers: { Authorization: `Bearer ${token}` } });

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