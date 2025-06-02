import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Option1 from './pages/HdfcStatement';
import Option2 from './pages/Option2';
import Option3 from './pages/Option3';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';
import * as XLSX from 'xlsx';


function App() {
  const [user, setUser] = useState(null);
  const [fileData, setFileData] = useState([]);


  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);
  }, []);




  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="container">
        {user && (
          <aside className="sidebar">
          <div className="sidebar-top">
            <h2 className="logo">TextShare 📝</h2>
            <nav className="menu">
              <Link to="/home" className="menu-link">Home</Link>
              <Link to="/HdfcStatement" className="menu-link">Option 1</Link>
              <Link to="/option2" className="menu-link">To Do</Link>
              <Link to="/option3" className="menu-link">Option 3</Link>
            </nav>
          </div>
        
          {/* <button className="logout-button" onClick={handleLogout}>Logout</button> */}
        </aside>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/home" />} />
            <Route path="/signup" element={!user ? <Signup setUser={setUser} /> : <Navigate to="/home" />} />
            
            {/* Protected Routes */}
            <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/HdfcStatement" element={user ? <Option1 /> : <Navigate to="/login" />} />
            <Route path="/option2" element={user ? <Option2 /> : <Navigate to="/login" />} />
            <Route path="/option3" element={user ? <Option3 /> : <Navigate to="/login" />} />

            {/* Default */}
            <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
