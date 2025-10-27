import { doc, runTransactions, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Atomically mark a listing as booked.
 * Returns the update doc data if success; throws if already booked.
 */
export async function bookListingAtomically(listingId, userId, paymentInfo = {}) {
    const listingRef = doc(db, "apartments", listingId);

    return await runTransactions(db, async (txn) => {
        const snap = await txn.get(listingRef);
        if (!snap.exists()) throw new Error("Listing not found.");
        const data = snap.data();
        if (!data.available) {
            throw new Error("Listing already booked.");
        }

        // update it to booked
        txn.update(listingRef, {
            available: false,
            bookedBy: userId,
            bookedAt: serverTimestamp(),
            payment: paymentInfo // store payment summary (id, method, amount)
        });

        return { id: listingId, ...data, bookedBy: userId };
    });
}    
