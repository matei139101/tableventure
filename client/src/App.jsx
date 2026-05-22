import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/users/Login';
import Register from './pages/users/Register';
import Dashboard from '@/pages/users/Dashboard';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
