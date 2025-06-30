import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  const [ticketBookingDate, setTicketBookingDate] = useState(null);

  const navigate = useNavigate();

  const login = async () => {
    try {
      const loginInputs = { email, password };

      const res = await axios.post('http://localhost:6001/login', loginInputs);

      // Save user info to localStorage
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('userType', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      // Navigate based on user type
      switch (res.data.usertype) {
        case 'customer':
          navigate('/');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'flight-operator':
          navigate('/flight-admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed!');
    }
  };

  const register = async () => {
    try {
      const inputs = { username, email, usertype, password };

      const res = await axios.post('http://localhost:6001/register', inputs);

      // Save user info to localStorage
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('userType', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      // Navigate based on user type
      switch (res.data.usertype) {
        case 'customer':
          navigate('/');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'flight-operator':
          navigate('/flight-admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed!');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider
      value={{
        login,
        register,
        logout,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype,
        ticketBookingDate,
        setTicketBookingDate,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
