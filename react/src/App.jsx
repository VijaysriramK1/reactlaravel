import './App.css'
import React, { useEffect, useState } from 'react';
import Create from './Components/Product/Create';
import List from './Components/Product/List';
import Edit from './Components/Product/Edit';
import Login from './Components/Auth/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('user_auth_token');   
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);


  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/list" element={isAuthenticated ? <List /> : <Login />} />
      <Route path="/create" element={isAuthenticated ? <Create /> : <Login />} />
      <Route path="/edit/:id" element={isAuthenticated ? <Edit /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
