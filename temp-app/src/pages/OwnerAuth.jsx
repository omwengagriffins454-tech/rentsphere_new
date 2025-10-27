import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function OwnerAuth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);

    const handleSubmit= async (e) => {
        e.preventDefault();
        try {
            if (isSignup) {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login successful!");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="flex flex-col item-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">
                    {isSignup ? "Owner Sign Up" : "Owner Login"}
                </h2>
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-2 mb-3 w-full rounded"
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="bg-blue-600 text-white p-2 rounded w-full">
                    {isSignup ? "Sign Up" : "Login"}
                  </button>
                  <p
                    onClick={() => setIsSignup(! isSignup)}
                    className="mt-2 text-blue-500 text-sm cursor-pointer">
                        {isSignup ? "Already have an account? Login" : "create new account"}
                    </p>
            </form>
        </div>
    );
} 