import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function AdminEmailLogs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        async function fetchLogs() {
        const snap = await getDocs(collection(db, "emailLogs"));
        setLogs(snap.docs.map(doc => doc.data()));
    }
    fetchLogs();
 }, []);

 return (
    <div className="p-6">
        <h1>Email Logs</h1>
        <table>
            <thead>
                <tr>
                    <th>User</th><th>Email</th><th>Method</th><th>Status</th><th>Transaction</th>
                </tr>
            </thead>
            <tbody>
                {logs.map((log, i) => (
                    <tr key={i}>
                        <td>{log.name}</td>
                        <td>{log.email}</td>
                        <td>{log.method}</td>
                        <td>{log.status}</td>
                        <td>{log.transaction_id}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
 );
}
 