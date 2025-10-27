import { useState } from "react";
import axios from "axios";
import { sendPaymentEmail } from "../utils/sendEmail";

export default function MpesaButton() {
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");

    const handlePayment = async () => {
        setMessage("Procesing payment...");

        try {
            const response = await axios.post("https://localhost:5000/api/stkpush", {
                phone,
                amount,
            });
            if (response.data.success) {
                setMessage("&#9989;Check your phone to complete payment.");
            } else {
                setMessage("Payment failed.");
            }
        } catch (err) {
            setMessage("Error sending payment request.");
        }
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>&$128176;Pay with M-Pesa</h3>
            <input 
              type="text"
              placeholder="Enter phone number (e.g. 2547xxxxxx)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ padding: "8px", width: "280px", marginBottom: "10px"}}
              />
              <br />
              <button
                onClick={handlePayment}
                style={{
                    backgroundColor: "#34B233",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                }}
                >
                  Pay Now 
                </button>
                <p>{message}</p> 
        </div>
    );
}

await sendPaymentEmail({
    name: userName,
    email: userEmail,
    amount,
    method: "M-Pesa",
    transaction_id: mpesaReceipt,
});