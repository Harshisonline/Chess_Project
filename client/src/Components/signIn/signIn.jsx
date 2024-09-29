import React from 'react';
import styles from './signIn.module.css';
import axios from 'axios';
import { useAuth } from '../../Contexts/authContext';
import { Link, useNavigate,Navigate } from 'react-router-dom';

const SignIn = () => {
  const { isLoggedIn, setIsLoggedIn, setToken } = useAuth();
  const [userDetails, setDetails] = React.useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', {
        username: userDetails.username,
        password: userDetails.password
      });

      if (response.data.token) {
        setIsLoggedIn(true);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        alert("You are logged in");
        navigate('/home');
      } else {
        alert("Password is incorrect");
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Login</h1>

        <input 
          value={userDetails.username} 
          onChange={handleChange}
          className={styles.input} 
          type="text" 
          placeholder='Username' 
          name="username" 
        />

        <input 
          value={userDetails.password} 
          onChange={handleChange}
          className={styles.input} 
          type="password" 
          placeholder='Password' 
          name="password" 
        />
        
        <button type='submit' className={styles.button}>Login</button>

        <Link to={'/home'}>home</Link>
      </form>
    </div>
  );
}

export default SignIn;
