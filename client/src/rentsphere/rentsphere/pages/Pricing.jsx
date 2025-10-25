import React from "react";
import MpesaButon from "../components/MpesaButton";
import PayPalButton from "../components/MpesaButton";

export default function Pricing() {
     return (
<div>
    <h2>Pricing</h2>
    <p>Free / Premium / Business — contact us for custom plans.</p> 
</div>

  
  ); 
 
     return (
      <div style={{ padding: "40px" }}>
        <h2>Choose Your Payment Method</h2>
        <p>Pay with either PayPal or M-Pesa</p>

        <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
          <div>
            <h3>Pay with PayPal</h3>
            <PayPalButton />
          </div>
        </div>
      </div>
    );
  }