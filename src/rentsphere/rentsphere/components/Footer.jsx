import React from 'react'
import ContactForm from './components/ContactForm'
<contactForm />
import AuthForm from '../components/AuthForm'
<AuthForm />

export default function Footer(){
  return (
    <footer style={{background:'transparent',padding:'24px 0'}}>
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>© {new Date().getFullYear()} Rentsphere</div>
        <div style={{color:'var(--muted)'}}>Connecting renters with trusted apartment owners.</div>
      </div>
    </footer>
  )
}