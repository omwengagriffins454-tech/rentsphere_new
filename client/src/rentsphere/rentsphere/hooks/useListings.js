import { useEffect, usestate } from "react";
import { collection, query, where, onSnapshort } from "firebase/firestore";
import { db } from "../firebase";

export default function useListings() {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const q = querry(collection(db, "apartments"), where("available", "==", true));
        const unsub = onSnapshot(q, (snap) => {
            setListings(snap.doc.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (err) => {
            console.error("listing listener error:", err);
    });

    return () => unsub();
}, []);

return listings;
}