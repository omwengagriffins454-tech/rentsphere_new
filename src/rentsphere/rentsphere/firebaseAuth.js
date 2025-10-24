import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sighOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);

// Signup (with role)
export const signup = async (EmailAuthCredential, password, role) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user info in Firestore
        await setDoc(doc(db, "users", user.uid),
    {
        email,
        role, // either "tenant" or "owner"
        CreatedAt: new Date(),
    });

    return user;
    } catch (error) {
        console.error("Signup error:", error.message);
        throw error;
    }
};

// Login
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
};

// Logout
export const logout = async () => {
    await signOut(auth)
};