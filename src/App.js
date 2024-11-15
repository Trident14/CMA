import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';

import { Auth } from "./components/auth.js";
import { Navbar } from './components/Navbar';
import { useCookies } from "react-cookie";
import Dashboard from './components/Dashboard.js';
import NotAuthorized from './components/Authorized-401.js';
import EditCar from './components/EditCar';  // EditCar component
import CreateCar from './components/CreateCar.js';


function App() {
  const [cookies] = useCookies(["access_token"]);

  return (
    <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Auth />} />
            <Route path='/auth' element={<Auth />} />
            <Route path="/dashboard" element={!cookies.access_token ? <NotAuthorized /> : <Dashboard />} />
            <Route path="/car/edit/:carId" element={!cookies.access_token ? <NotAuthorized /> : <EditCar />} />
            <Route path="/car/create" element={!cookies.access_token ? <NotAuthorized /> : <CreateCar />} />
         
          </Routes>
        </Router>
    </div>
  );
}

export default App;
