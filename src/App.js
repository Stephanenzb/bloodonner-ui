import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles/App.css';
import Index from './index';
import RegistrationPage from './pages/RegistrationPage'; 
import DonorHome from './pages/DonorHome';
import AdminHome from './pages/AdminHome' ;
import DonorsList from './pages/DonorsList'; 
import ManageAppointment from './pages/ManageAppointment'; 
import DonorHistory from './pages/DonorHistory';
import AppointmentForm from './pages/AppointmentForm'; 
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from './pages/Unauthorized'
import { isAuthenticated } from './ProtectedRoute'; 
import logo from "./images/logo.png";
import CentersMap from "./pages/CentersMap";
import AnalyseForm from './pages/Analyse';
import BloodPrelevement from './pages/BloodPrelevement';
import DonorsBloodStats from './pages/DonorsBloodStats' 
const userRole = localStorage.getItem('userRole');


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
        <h1 className="header-title"><img src={logo} alt="Logo Be Best Donor" className="logo" />BloodLink</h1>
          <p>
            Ensemble, faisons la différence. Devenez donneur de sang et sauvez des vies.
          </p>
        </header>
        
        <main className="App-main">
          <Routes>
              <Route path="/"                       element={<Index />} />  
              <Route path="/index"                  element={<Index />} />                                              
              <Route path="/registration"           element={<RegistrationPage />} />                                             
              <Route path="/home" element={<ProtectedRoute requiredRole="donor" element={<DonorHome />} />} />
              <Route path="/donor-history" element={<ProtectedRoute requiredRole="donor" element={<DonorHistory />} />} />
              <Route path="/appointment-form" element={<ProtectedRoute requiredRole="donor" element={<AppointmentForm />} />} />
              <Route path="/analyses" element={<ProtectedRoute requiredRole="donor" element={<AnalyseForm />} />}/>  
              <Route path="/bloodprelevements" element={<ProtectedRoute requiredRole="donor" element={<BloodPrelevement />} />} />
              <Route path="/admin-home" element={<ProtectedRoute requiredRole="admin" element={<AdminHome />} />} />
              <Route path="/donor-list" element={<ProtectedRoute requiredRole="admin" element={<DonorsList />} />} />
              <Route path="/manage-appointments" element={<ProtectedRoute requiredRole="admin" element={<ManageAppointment />} />} />
              <Route path="/centers"  element={<ProtectedRoute requiredRole="admin" element={<CentersMap />}  />}/>  
              <Route path="/bloodstats"  element={<ProtectedRoute requiredRole="admin" element={<DonorsBloodStats />}  />}/>  
              <Route path="/unauthorized"                       element={<Unauthorized />} />


          </Routes>


        </main>
        <footer className="App-footer">
          <p>© 2024 BloodLink. Tous droits réservés.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
