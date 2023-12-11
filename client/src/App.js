import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom'
import UserPage from './Pages/UserPage';
import RegisterLogin from './Pages/RegisterLogin';
import AdminPage from './Pages/AdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterLogin/>}/>
      <Route path="/user" element={<UserPage/>}/>
      <Route path="/admin" element={<AdminPage/>}/>
      {/* <Route path="/user/:userid/:role" element={<UserPage/>}/> */}
    </Routes>
  );
}

export default App;


