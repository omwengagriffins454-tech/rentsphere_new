import { useState } from "react";
import { auth, provider, db } from "../firebase";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    // Register new users
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date()
            });
            setUser(user);
            alert("Registration successful!");
        } catch (err) {
            SetError(err.message);
        }
    };

    // Google Login
    const handleGoogleLogin = async () => {
        try {
            const results = await signInWithPopup(auth, provider);
            const user = results.user;
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                name: user.displayName,
                createdAt: new Date()
            });
            setUser(user);
            alert('Welcome ${user.displayName}!');
        } catch (err) {
            setError(err.message);
        }
    };

    // Logout
    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <div style={{ padding: "1rem", border: "1px solid #ccc", maxWidt: "400px" }}>
            {!user ? (
                <>
                <h3>Rentsphere Login / Register</h3>
                <form>
                    <input
                      type="email"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    /><br />
                    <input
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    /><br />
                    <button onclick={handleLogin}>Login</button>
                    <button onclick={handleRegister}>Sign Up</button>    
                      </form>
                      
                      <p>or</p>
                      <button onClick={handleGoogleLogin}>Sign in with Google</button>
                      
                      {error && <p style={{ color: "red" }}>{error}</p>}
                </>
            ) : (
                <>
                <h3>Welcome, {user.email}</h3>
                <button onClick={handleLogout}>Logout</button>
                </>  
            )}
        </div>
    );
}