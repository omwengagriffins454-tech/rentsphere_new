import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function PaymentsDashboard() {
    const [transactions, setTransactions] = useState([]);

    useefffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q,(snapshot) => {
            const txs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTransactions(txs);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            {transactions.length === 0 ? (
                <p>No payments recorded yet.</p>
            ) : (
              <table className="min-e-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Method</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id}>
                            <td className="p-2 border">{t.method}</td>
                            <td className="p-2 border">{t.amount}</td>
                            <td className="p-2 border">{t.status === "success" ? "&#9989;Success" : "Pending"}</td>
                            <td className="p-2 border">{t.timestamp?.toDate? t.timestamp.toDate().toLocaleString()
                            : "_"}
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>      
            )}
        </div>
    );
}