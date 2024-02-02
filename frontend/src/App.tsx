import React, { useContext } from 'react';
import Home from './pages/home/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import { AuthContext } from './state/AuthContext';
import "./App.css";

function App() {
  const { state: authState } = useContext(AuthContext)
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={authState.user ? <Home /> : <Navigate to="/login" />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/> 
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
