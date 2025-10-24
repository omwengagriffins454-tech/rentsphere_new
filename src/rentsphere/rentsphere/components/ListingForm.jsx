import { usestate } from "react";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ListingForm() {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
    const [loading ,setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        if (!auth.currentUser) {
            return setMessage("Please sign in first.");
        }
        if (!image) {
            return setMessage("Please select an image.");
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            const fileref = ref(storage, 'listingImages/${user.uid}/${Date.now()}_${image.name');
            await uploadBytes(fileRef, image);
            const imageUrl = await getDownloadURL(fileRef);

            // Save listings to Firestore
            await addDoc(collection(db, "listings"),{
                title,
                price: parseFloat(price),
                location,
                imageUrl,
                ownerId: user.uid,
                featured: false,
                createAt: serverTimestamp()
            });

            setTitle("");
            setPrice("");
            setLocation("");
            setImage(nill);
            setMessage("&#9989;Listing created successfully!");
        } catch (err) {
            console.error(err);
            setMessage("Error creating listing: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Create a Listing</h2>

            <input 
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.terget.value)}
              className="border p-2 w-full mb-3"
              reqired
            />

            <input
              type="number"
              placeholder="price (USD)"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="border p-2 w-full mb-3"
              required
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="border p-2 w-full mb-3"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files[0])}
              className="mb-3"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Uploading..." : "Create Listing"}
                </button>

                {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}          
        </form>
    );
}