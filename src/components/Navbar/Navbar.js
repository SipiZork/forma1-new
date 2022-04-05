import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ loggedIn, logoutUser }) => {
  return (
    <div className='navbar'>
      <div className="logo">
        <Link to="/">Races</Link>
        {loggedIn &&
          <Link to="/point-race">Point Race</Link>
        }
      </div>
      <div className="navbar-menu">
      {!loggedIn ?
        <Link to="/login">Sign in</Link>
      :
        <Link onClick={() => logoutUser()} to="#">Sign out</Link>
      }
      </div>
    </div>
  )
}

export default Navbar;