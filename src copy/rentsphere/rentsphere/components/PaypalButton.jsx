import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYMENT_AMOUNTS } from "../config/payments";
import { useAuth } from "../context/AuthContext";
import { sendPayMentEmail } from "../utils/sendEmail";

const handleApprove = async (orderID, amount) => {
    try {
        const user = auth.currentUser;
        const name = user?.displayName || "Rentsphere User";
        const email = user?.email || "unknown";

        if (user) {
            await AddDocs(collection(db, "transactions"), {
                userId: user.uid,
                method: "paypal",
                amount: Number(amount),
                orderID,
                status: "success",
                timestamp: serverTimestamp(), 
            });
        }

        // Send confirmation email
        await sendPaymentEmail({
            name,
            email,
            amount,
            method: "PayPal",
            transaction_id: orderID,
        });

        alert("&$9989;Payment successful! Confirmation email sent.");
    } catch (error) {
        console.error("Error saving transaction:", error);
    }
};

export default function PayButton () {
    const { currentUser } = useAuth(); // Assume Firebase Auth Context
    const role = currentUser?.role || "tenants"; // default to tenants
    const payment = PAYMENT_AMOUNTS[role];

    return (
        <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
            <div>
                <h3>{payment.description}</h3>
                <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            description:payment.description,
                            amount: { value: (payment.amount / 150).toFixed(2)}, //convert Ksh to USD (approx)
                        }],
                    });
                }}
                onApprove={async (data, actions) => {
                    const order = await actions.order.capture();
                    alert('&#9989;Payment successful for ${role}!');
                    // Mark payment as verify in Firestore
                    // (you can update user doc or add 'payments' collection)
                }}
                />
            </div>
        </PayPalScriptProvider>      
    );
}
  
