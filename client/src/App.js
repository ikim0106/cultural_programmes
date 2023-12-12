import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import UserPage from './Pages/UserPage';
import RegisterLogin from './Pages/RegisterLogin';
import LocationPage from './Pages/LocationPage';
import LocationDetailPage from './Pages/LocationDetailPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterLogin />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/LocationPage" element={<LocationPage />} />
      <Route path="/LocationDetailPage" element={<LocationDetailPage />} />
      {/* <Route path="/user/:userid/:role" element={<UserPage/>}/> */}
    </Routes>
  );
}

export default App;


