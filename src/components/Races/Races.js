import React, { useEffect, useState } from 'react';
import RaceCard from './RaceCard.js';

import { db } from '../../lib/init-firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

const Races = ({ user, loggedIn, selectedRaceHandler, drivers, isLoading, races }) => {

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