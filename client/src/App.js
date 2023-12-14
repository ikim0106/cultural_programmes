import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import UserPage from './Pages/UserPage';
import RegisterLogin from './Pages/RegisterLogin';
import AdminPage from './Pages/AdminPage';

import LocationDetailPage from './Pages/LocationDetailPage';
import UserFavouriteLocation from './Pages/UserFavouriteLocationPage';
import EmailVerificationPage from './Pages/EmailVerificationPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterLogin />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/LocationDetailPage" element={<LocationDetailPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/myFavourite" element={<UserFavouriteLocation />} />
      <Route path="/EmailVerification" element={<EmailVerificationPage />} />
      {/* <Route path="/user/:userid/:role" element={<UserPage/>}/> */}
    </Routes>
  );
}

export default App;


