import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Logs email deliver results to Firestore
 */
export async function logEmailActivity({ name, email, amount, method, transaction_id, status, error }) {
    try {
        await addDocs(collection(db, "emailLogs"),
    {
        name,
        email,
        amount,
        method,
        transaction_id,
        status, // "success" or "failed"
        error: error || null,
        timestamp: serverTimestamp(),
    });

    console.log('Email log saved (${status})');
    } catch (err) {
        console.error("Could not save email log:", err);
    }
}