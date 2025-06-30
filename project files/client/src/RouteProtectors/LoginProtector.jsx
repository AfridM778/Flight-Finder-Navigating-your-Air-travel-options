import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const LoginProtector = ({ children }) => {
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const userType = localStorage.getItem('userType');

    if (userType === 'customer') {
      setRedirectPath('/');
    } else if (userType === 'admin') {
      setRedirectPath('/admin');
    } else if (userType === 'flight-operator') {
      setRedirectPath('/flight-admin');
    }
  }, []);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default LoginProtector;
