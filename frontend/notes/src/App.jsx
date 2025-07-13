import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Labels from './pages/Labels';
import Notes from './pages/Notes';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';  // ✅ Required
import UpdateProfile from './pages/UpdateProfile';

import SidebarLayout from './components/SidebarLayout';
import ResetPassword from './pages/ResetPassword';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/reset-password" element={<ResetPassword />} />





        <Route element={<ProtectedRoute />}>
          <Route element={<SidebarLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/labels" element={<Labels />} />
            <Route path="/label/:id" element={<Notes />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
