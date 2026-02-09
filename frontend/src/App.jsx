import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Activities from './pages/Activities';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import ActivityDetail from './pages/ActivityDetail';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actividades" element={<Activities />} />
          <Route path="/actividades/:id" element={<ActivityDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;