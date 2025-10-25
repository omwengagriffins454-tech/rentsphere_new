import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    const handleChane = (e) => {
        setForm({ ...form, [e.target.name]:e.trget.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");
        try {
            await addDoc(collection(db, "contacts"), {
                ...form,
                createdAt: Timestamp.now(),
            });
            setStatus("Message sent successfully!");
            setForm({ name: "", email: "", message: ""});
        } catch (err) {
            console.error(err);
            setStatus("Failed to send message.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Your Name" onChange={handleChange} value={form.name} />
            <input name="email" placeholder="Your Email" onChange={handleChange} value={form.email} />
            <textarea name="message" placeholder="Message" onChange={handleChange} value={form.message}></textarea>
            <button type="submit">Send</button>
            <p>{status}</p>
        </form>
    );
}