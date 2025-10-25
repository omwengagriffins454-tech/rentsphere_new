import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div>
      <section style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:24,alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:36}}>Find your next home with ease</h1>
          <p style={{color:'var(--muted)'}}>Rentsphere connects apartment owners with renters. Browse verified listings or post your property in minutes.</p>
          <div style={{marginTop:12}}>
            <Link to="/listings" className="cta">Browse Listings</Link>
            <Link to="/dashboard" className="cta" style={{marginLeft:8}}>Post a Listing</Link>
          </div>
        </div>
        <div style={{background:'var(--card)',padding:16,borderRadius:12}}>
          <h4>Why Rentsphere</h4>
          <ul style={{color:'var(--muted)'}}>
            <li>Verified Listings</li>
            <li>Direct Connections</li>
            <li>Smart Search</li>
          </ul>
        </div>
      </section>
    </div>
  )
}