import React, { useState } from 'react';
import Button from '../Button/Button';
import { getAuth, updatePassword } from 'firebase/auth';

const Settings = ({ user }) => {

  const [formData, setFormData] = useState({
    password: '',
    passwordAgain: ''
  });

  const inputHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className='settings'>
      <div className="input-group">
        <input type="password" name="password" value={formData.password} onChange={inputHandler} />
        <label>New Password</label>
      </div>
      <div className="input-group">
        <input type="password" name="passwordAgain" value={formData.passwordAgain} onChange={inputHandler} />
        <label>New Password Again</label>
      </div>
      <Button>Új Jelszó beállítása</Button>
    </div>
  )
}

export default Settings;