import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthProtector = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (!userType) {
      navigate('/');
    }
  }, [navigate]);

  return children;
};

export default AuthProtector;
