import React, {useState, useEffect} from 'react'
import { auth, db, storage } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Dashboard(){
  const [user, setUser] = useState(null)
  const [title,setTitle]=useState('')
  const [location,setLocation]=useState('')
  const [price,setPrice]=useState('')
  const [description,setDescription]=useState('')
  const [file,setFile]=useState(null)

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u=> setUser(u))
    return ()=> unsub()
  },[])

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!user){ alert('Please login'); return }
    let imageUrl = ''
    if(file){
      const storageRef = ref(storage, `listings/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      imageUrl = await getDownloadURL(storageRef)
    }
    await addDoc(collection(db,'listings'),{
      title, location, price, description, imageUrl, ownerId: user.uid, createdAt: new Date()
    })
    setTitle(''); setLocation(''); setPrice(''); setDescription(''); setFile(null)
    alert('Listing added')
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {!user && <p>Please log in to post listings.</p>}
      {user && (
        <form onSubmit={handleSubmit} style={{maxWidth:720}}>
          <label>Title</label>
          <input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} required />
          <label>Location</label>
          <input className="form-control" value={location} onChange={e=>setLocation(e.target.value)} required />
          <label>Price (KES)</label>
          <input className="form-control" value={price} onChange={e=>setPrice(e.target.value)} required />
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={e=>setDescription(e.target.value)} required />
          <label>Photo</label>
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <button className="btn" style={{marginTop:8}}>Add Listing</button>
        </form>
      )}
    </div>
  )
}