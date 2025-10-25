import { bookListingAtomically } from "../utils/bookListing";
import { auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

async function handlePayPalApprove(data, actions, listingId, amount) {
    // capture payment
    const details = await actions.order.capture();
    const orderId = data.orderId;
    const payerEmail = details.payer.email_address;

    // 1) write transaction record 
    await addDoc(collection(db, "transactions"), {
        userId: auth.currentUser?.uid || null,
        method: "paypal",
        amount: Number(amount),
        orderId,
        payerEmail,
        status: "completed",
        timestamp: serverTimestamp(),
    });

    // 2) atomically book listing (this will throw if alredy booked)
    try {
        await bookListingAtomically(listingId, auth.currentUser.uid, {
            method: "paypal",
            orderId,
            amount,
        });
        alert("Booking successful - listing reserved for you.");
        //UI will auto-update because of the real-time listener
    } catch (err) {
        console.error("Booking failed:", err.message);
        alert("Booking failed: " + err.message);
        // consider refunding the payment if booking cannot proceed.
    }
}