// Student Name : Ng Tik Wai, Inho Kim, Chan Yau Ki, Mak Wing Chit, Ngai Wai Ki
// Student ID : 1155151991, 1155116159, 1155157432, 1155157789, 1155158093
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import UserPage from './Pages/UserPage';
import RegisterLogin from './Pages/RegisterLogin';
import AdminPage from './Pages/AdminPage';

import LocationDetailPage from './Pages/LocationDetailPage';
import UserFavouriteLocation from './Pages/UserFavouriteLocationPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterLogin />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/LocationDetailPage" element={<LocationDetailPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/myFavourite" element={<UserFavouriteLocation />} />
      {/* <Route path="/user/:userid/:role" element={<UserPage/>}/> */}
    </Routes>
  );
}

export default App;


