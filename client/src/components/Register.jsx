import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import '../styles/Authenticate.css'; // Make sure styles are applied globally

const Register = ({ setIsLogin }) => {
  const {
    setUsername,
    setEmail,
    setPassword,
    usertype,
    setUsertype,
    register,
  } = useContext(GeneralContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    await register();
  };

  return (
    <form className="authForm shadow">
      <h2 className="authTitle">Create an Account</h2>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="text"
          className="form-control"
          id="floatingUsername"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="floatingUsername">Username</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="email"
          className="form-control"
          id="floatingEmail"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="floatingEmail">Email Address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <select
        className="form-select mb-3"
        onChange={(e) => setUsertype(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Select User Type
        </option>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
        <option value="flight-operator">Flight Operator</option>
      </select>

      <button className="btn btn-success w-100 mt-2" onClick={handleRegister}>
        Sign Up
      </button>

      <p className="switchText mt-3">
        Already have an account?{' '}
        <span className="linkStyle" onClick={() => setIsLogin(true)}>
          Login
        </span>
      </p>
    </form>
  );
};

export default Register;
