import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ loginUser, loggedIn }) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate('/');
    }
  }, [loggedIn])

  const inputHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const buttonHandler = (e) => {
    e.preventDefault();
    loginUser(formData.email, formData.password);
  }

  return (
    <form className='login-form'>
      <div className="input-group">
        <input name="email" type="text" value={formData.email} onChange={(e) => inputHandler(e)} autoComplete="email" required />
        <label>Email address</label>
      </div>
      <div className="input-group">
        <input name="password" type="password" value={formData.password} onChange={(e) => inputHandler(e)} autoComplete="current-password" required />
        <label>Password</label>
      </div>
      <button onClick={(e) => buttonHandler(e)}>Login</button>
    </form>
  )
}

export default Login;