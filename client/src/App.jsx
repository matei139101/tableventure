import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/users/Login';
import Register from './pages/users/Register';
import Dashboard from '@/pages/users/Dashboard';
import Navbar from './components/Navbar';

import Overview from './pages/adventures/Overview';
import Create from './pages/adventures/Create';
import Edit from './pages/adventures/Edit';
import Play from './pages/adventures/Play';

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/dashboard" element={<Dashboard />} />

        <Route path="/adventures/" element={<Overview />} />
        <Route path="/adventures/create" element={<Create />} />
        <Route path="/adventures/edit/:id" element={<Edit />} />
        <Route path="/play/:id" element={<Play />} />
      </Routes>
    </>
  );
}
