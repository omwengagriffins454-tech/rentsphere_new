import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function createUserProfile(user, role) {
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role,
        verifiedPayment: false,
        createdAt: new Date()
    });
}