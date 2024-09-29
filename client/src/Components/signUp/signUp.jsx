import React from 'react';
import styles from './signUp.module.css';
import axios from 'axios';

const SignUp = () => {
  const [userDetails, setDetails] = React.useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(userDetails);

    try {
      const response = await axios.post('http://localhost:3000/register', {
        username: userDetails.username,
        password: userDetails.password
      });
      alert(response.data);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Register Yourself</h1>
        
        <input 
          value={userDetails.username} 
          onChange={handleChange} // Correct event handler
          className={styles.input} 
          type="text" 
          placeholder='Username' 
          name="username" 
        />

        <input 
          value={userDetails.password} 
          onChange={handleChange} // Correct event handler
          className={styles.input} 
          type="password" 
          placeholder='Password' 
          name="password" 
        />
        
        <button type='submit' className={styles.button}>Register</button>
      </form>
    </div>
  );
}

export default SignUp;
