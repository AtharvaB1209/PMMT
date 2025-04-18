  

import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role,
        name
      });
      alert('Signup successful!');
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} required /><br />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br />
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="guide">Guide</option>
      </select><br />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default Signup;
