import React, { useContext } from 'react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {
  const navigate = useNavigate();
  const usertype = localStorage.getItem('userType');
  const { logout } = useContext(GeneralContext);

  return (
    <nav className="custom-navbar navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <div className="container-fluid">
        <span className="navbar-brand">
          {usertype === 'admin'
            ? 'SKYJETS (Admin)'
            : usertype === 'flight-operator'
            ? 'SKYJETS (Operator)'
            : 'SKYJETS'}
        </span>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex gap-3 align-items-center">

            {!usertype ? (
              <>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/')}>Home</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/auth')}>Login</span>
                </li>
              </>
            ) : usertype === 'customer' ? (
              <>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/')}>Home</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/bookings')}>Bookings</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={logout}>Logout</span>
                </li>
              </>
            ) : usertype === 'admin' ? (
              <>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/admin')}>Home</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/all-users')}>Users</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/all-bookings')}>Bookings</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/all-flights')}>Flights</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={logout}>Logout</span>
                </li>
              </>
            ) : usertype === 'flight-operator' ? (
              <>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/flight-admin')}>Home</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/flight-bookings')}>Bookings</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/flights')}>Flights</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={() => navigate('/new-flight')}>Add Flight</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link link-style" onClick={logout}>Logout</span>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
