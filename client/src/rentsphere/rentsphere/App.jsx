import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Listings from './pages/Listings'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Contact from './pages/Contact'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import Header from './components/Header'
import Footer from './components/Footer'
import OwnerDashboard from './pages/OwnerDashboard'
import Navbar from '.components/Navbar'
import Listing from './components/ListingForm'
import PaymentsDashboard from './pages/PaymentsDashboard'

function App() {
  const currentOwnerId = "owner123"; // Replace with auth user ID
}

export default function App(){
  return (
    <div>
      <Header />
      <main className="container" style={{minHeight:'70vh'}}>
        <Navbar>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/listings" element={<Listings/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/features" element={<Features/>} />
          <Route path="/pricing" element={<Pricing/>} />
          <Route path="/owner-dashboard" element={<OwnerDashboard ownerId={currentOwnerId} />} />
          <Route path="/add-listing" element={currentUser?.role === "owner" ? <AddListing /> : <Navigate to="/login" />}
          />
          <Route path="/dashboard/payments" element={<PaymentsDashboard />} />
        </Routes>
        </Navbar>
      </main>
      <Footer />
    </div>
  )
}