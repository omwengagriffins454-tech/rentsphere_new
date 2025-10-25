import React, { useState } from "react"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import PaymentGateway from "./PaymentGateway";
import axios from "axios";

function ListingCard({ listing }) {
  const handleMpesaPayment = async () => {
    const phone = prompt("Enter your M-Pesa phone number (e.g. 2547xxxxxxxx");
    if (!phone) return;

    try {
      const res = await axios.post("https://location:5000/api/mpesa/stkpush", {
        phone,
        amount: listing.bookingFee,
        listingId: listing.id,
      });
      alert("Payment prompt sent to your phone.Complete it to book.");
    } catch (err) {
      console.error(err);
      alert("M-pesa")
    }
  }
}

const ListinngCard = ({ listing }) => {
  const [booked, setBooked] = useState(listing.booked);
const [ showPayment, setShowPayment ] = useState(false);

const handlePaymentSuccess = async (method) => {
  await updateDoc(doc(db, "listings",listing.id), { booked: true });
  setBooked(true);
  alert('&#9989;Booked successfuly via ${method}');
} ;

return(
  <div className="booder p-4 rounded-lg shadow-sm bg-white">
  <h3 className="text-lg font-semibold">{listing.title}</h3>
  <p>&#128176;Ksh {listing.price}</p>
  <p>&#128205;{listing.location}</p>

  {booked ? (
    <span className="text-green-600 font-bold">&#10004;Booked </span>
  ) : showPayment ? (
    <paymentGateway amount={50} onPaymentSuccess={handlePaymentSuccess} />
  ) : (
    <button
      onClick={() => setShowPayment(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Book Now (Ksh 100)
      </button>
  )}  
  </div>
);
};

export default ListingCard;