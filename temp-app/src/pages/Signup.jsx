import React, {useState} from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { signup } from "../firebaseAuth";

export default function Signup(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('tenant') // tenant or owner
  const [message, setMessage] = uiseState("");
  const navigate = useNavigate()

  const handle = async (e)=>{
    e.preventDefault()
    try{
      const res = await createUserWithEmailAndPassword(auth,email,password)
      // save simple profile
      await setDoc(doc(db,'users',res.user.uid),{email,role,createdAt:new Date()})
      navigate('/dashboard')
    }catch(err){
      alert(err.message)
    }
  }
  return (
    <div style={{maxWidth:600}}>
      <h2>Sign up</h2>
      <form onSubmit={handle}>
        <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email"/>
        <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password"/>
        <label style={{display:'block',marginTop:8}}>I am a:</label>
        <select className="form-control" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="tenant">Tenant</option>
          <option value="owner">Owner</option>
        </select>
        <button className="btn" style={{marginTop:8}}>Create account</button>
      </form>
    </div>
  )
}