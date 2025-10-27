import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

//Safaricom credentials (from developer.safaricom.co.ke)
const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY } = process.env;
const BASE_URL = "https://sandbox.safaricom.co.ke";

async function getAccessToken() {
    const auth = Buffer.from('${MPESA_CONSUMER-KEY};${MPESA_CONSUMER_SECRET}').toString("base64");
    const response = await axios.get('${BASE_URL}/oauth/v1/generate?grant_type=client_credentials', {
        headers: { Authorization: 'Basic ${auth}'},
    });
    return response.data.access_token;
}

app.post("/api/mpesa/pay", async (req, res) => {
    try {
        const {amount, phone, listingId, userId } = req.body;
        const accessToken = await getAccessToken();

        const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        const password = Buffer.from('${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}').toString("base64");

        const response = await axios.post(
            '${BASE_URL}/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: amount,
                PartyA: phone,
                PartyB: MPESA_SHORTCODE,
                callBackURL: "https://your-domain.com/api/mpesa/callBack",
                AccountReference: "Rentsphere",
                TransactionDesc: 'Payment for listing ${listingId}',
            },
            { headers: { Authorization: 'Bearer ${accessToken}'}}
        );

        res.status(200).json({ status: "pending", data: response.data });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Failed to initiate payment" });
    }
});

//Callback edpoint from Safaricom
app.post("/api/mpesa/callback", (req, res) => {
    const results = req.body;
    console.log("M-Pesa Callback Reseived:", JSON.stringify(results, null, 2));
    res.json({ message: "callback reseived successfull" });

    // TODO: verify success and mark listing as booked in Firestore 
});

app. listen(5000, () => console.log("M-Pesa backend running on port 5000"));

