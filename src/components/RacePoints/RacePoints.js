import React from 'react';

const RacePoints = ({ loggedIn, usersPoints }) => {
  return (
    <div className='point-race'>
      {loggedIn ?
      <div className="point-race-content">
        {(loggedIn && usersPoints) && usersPoints.length > 0 && usersPoints.map((up, i) => (
          <div className="user-point" key={i}>
            <div className="name">{up.name}</div>
            <div className="points">{up.points}</div>
          </div>
        ))}
        </div>
        :
        <div>Nincs jogosultságod ehhez az oladlhoz, jelentkezz be</div>
      }
    </div>
  )
}

export default RacePoints;