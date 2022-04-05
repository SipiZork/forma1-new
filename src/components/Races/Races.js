import React from 'react';
import RaceCard from './RaceCard.js';

const Races = ({ loggedIn, selectedRaceHandler, drivers, isLoading, races }) => {

  return (
    <div className='race-list'>
      {isLoading ?
        <h2>Loading...</h2>
          :
        races.map((race, i) => (
          <RaceCard key={i} race={race} loggedIn={loggedIn} drivers={drivers} selectedRaceHandler={selectedRaceHandler} />
        ))
      }
    </div>
  )
}

export default Races;