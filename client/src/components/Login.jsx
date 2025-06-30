
import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import '../styles/Authenticate.css'; // make sure this file exists

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
    <form className="authForm shadow">
      <h2 className="authTitle">Welcome Back</h2>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="floatingInput">Email Address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Secret Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <button
        type="submit"
        className="btn btn-success w-100 mt-2 custom-login-btn"
        onClick={handleLogin}
      >
        Sign In
      </button>

      <p className="switchText mt-3">
        New here?{' '}
        <span className="linkStyle" onClick={() => setIsLogin(false)}>
          Create an account
        </span>
      </p>
    </form>
  );
};

export default Login;
