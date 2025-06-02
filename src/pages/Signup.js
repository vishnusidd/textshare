import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    if (email && password) {
      const fakeUser = { email };
      localStorage.setItem('user', JSON.stringify(fakeUser));
      setUser(fakeUser);
      navigate('/home');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>Signup</button>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Signup;
