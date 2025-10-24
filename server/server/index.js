import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import mpesaRoutes from "./mpesaRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/mpesa", mpesaRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

// Get Access Token
const getAccessToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from('${consumerKey}:${consumerSecret}').toSting("base64");
    const response = await axios.get(

        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" ,
        { headers: { Authorization: 'Basic $ {auth}'}}
    );
    return response.data.access_token;
};

// STK Push Endpoint
app.post("/api/stkpush", async (req, res) => {
    const { phone, amount } = req.body;

    try {
        const token = await getAccessToken();
        const timestamp = new Date()
        .toISOString()
        .replace(/[-T:\.Z]/g, "")
        .slice(0, 14);
        const password = Buffer.from(
            '${process.env.MPESA_SHORTCODE}$ {process.env.MPESA_PASSKEY}$ {timestamp}'
        ).toString("base64");

        const response = await axios.post(

            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                BusinessShortCode:process.env.MPESA_SHORTCODE,
                Password:password,
                Timestamp:timestamp,
                TransactionType:"CustomerPayBillOnline",
                Amount:amount,
                PartyA:phone,
                PartyB:process.env.MPESA_SHORTCODE,
                PhoneNumber: phone,
                CallBackURL: "https://yourdomain.com/api/callback",
                AccountReference: "Rentsphere",
                TransactionDesc: "Charges",
            },
            {
                headers:{Authorization:'Bearer ${token'},
            }
        );

        res.json({ success: true, data: response.data});
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ success: false, message: "Payment failed" });
    }
});

app.listen(5000, () => console.log("&#9989;Server running on port 5000"));