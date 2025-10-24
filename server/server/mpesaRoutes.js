import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const consumerKey = process.env.MPESSA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortCode = process.env.MPESA_SHORTCODE;
const passKey = process.env.MPESA_PASSKEY;
const callbackURL = process.env.MPESA_CALLBACK_URL; //e.g. https://yourserver.com/api/mpesa/callback

// helper to get token
async function getAccessToken() {
    const auth = Buffer.from('${consumerKey}:${consuemSecret}').toString("base64");
    const res = await axios.get(

        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        { headers: { Authorization: 'Basic ${auth}'}}
    );
    return res.data.access_token;
}

// STK push
router.post("/stkpush", async (req, res) => {
    const { phone, amount, listingId } = req.body;
    try {
        const token = await getAccessToken();
        const timestamp = new Date()
          .toISOString()
          .replace(/[0-9]/g, "")
          .slice(0, 14);
        const password = Buffer.from(shortCode + passKey + timestamp).toString("base64");
        
        const payload = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType:"CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: shortCode,
            PhoneNumber: phone,
            CallBackURL: callbackURL,
            AccountReference: listingId,
            TransactionDesc: "RentSphere booking", 
        };

        const response = await axios.post(

            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            payload,
            { headers: { Authorization: 'Bearer ${token}'}}
        );

        res.json({ success: true, data: response.data });
      } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.message });
      }    
});

export default router;