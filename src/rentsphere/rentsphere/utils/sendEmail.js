import emailjs from "emailjs-com";
import { logEmailActivity } from "./logEmailActivity";

export async function sendPaymentEmail({ name, email, amount, method, transaction_id }) {
    try {
        const templateParams = {
            user_name: name,
            user_email: email,
            amount,
            method,
            transaction_id,
        };

        const results = await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        // log success in Firestore
        await LogEmailActivity({
            name,
            email,
            amount,
            method,
            transaction_id,
            status: "success",
        });

        console.log("&#9989;Email sent successfully:", results.text);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}