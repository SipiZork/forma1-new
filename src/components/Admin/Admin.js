import React, { Fragment, useEffect, useState } from 'react';
import { db } from '../../lib/init-firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Button from '../Button/Button';


const Admin = ({ loggedIn, user, races, drivers }) => {

  const [userRank, setUserRank] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserRank();
    }
  }, [user, userRank]);
  
  const setDriversToRace = async (e) => {
    e.preventDefault();
    const actualRace = races.find(race => race.active);
    const raceDocRef = doc(db, 'races-datas/2022/races', /* RACE ID-T IDE ÍRD */ actualRace.id);
    const raceSnap = await getDoc(raceDocRef);
    if (!raceSnap.data().drivers || raceSnap.data().drivers.length < 1) {
      let driverNumbers = [];
      drivers.map(driver => {
        /* HA KI KELL HAGYNI VERSENYZŐT, MÁRPEDIG KI KELL A HELYETTESÍTÉS MIATT, AKKOR ITT ADD MEG, HOGY KIT KELL KIHAGYNI*/
        if (driver.number !== 27) {
          driverNumbers.push(driver.number);
        }
      });
      console.log(driverNumbers);
      updateDoc(raceDocRef, { drivers: driverNumbers });
    }
  }

  const getUserRank = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    setUserRank(userSnap.data().rank);
    setLoading(false);
  }

  const addPoints = (e) => {
    e.preventDefault();
    const actualRace = races.find(race => race.active);
    const raceRef = doc(db, 'races-datas/2022/races', actualRace.id);
    if (actualRace.votes.length > 0) {
      actualRace.votes.map(async (vote) => {
        const userRef = doc(db, 'users', vote.user);
        const userSnap = await getDoc(userRef);
        const userPoints = userSnap.data().points2022;
        let newPoints = 0;
        if (actualRace.winners.first === vote.first) { newPoints += 25; }
        if (actualRace.winners.second === vote.second) { newPoints += 18; }
        if (actualRace.winners.third === vote.third) { newPoints += 15; }
        if (actualRace.winners.fastestLap === vote.fastestLap) { newPoints += 1; }
        updateDoc(userRef, { points2022: userPoints + newPoints, points2022before: userPoints });
      });
    }
    updateDoc(raceRef, { end: true, active: false });
  }

  const changeVotableStatus = async (e) => {
    e.preventDefault();
    const actualRace = races.find(race => race.active);
    const raceRef = doc(db, 'races-datas/2022/races', actualRace.id);
    updateDoc(raceRef, { voteable: !actualRace.voteable });
  };

  return (
    <div className='admin'>
      {(loading) && 
        <div className="info">Töltés...</div>
      }
      {(!loading && loggedIn && userRank > 10) &&
        <Fragment>
          <Button onClick={(e) => addPoints(e)}>Add points and Close Race</Button>
          <Button onClick={(e) => setDriversToRace(e)}>Add drivers to Active Race</Button>
        </Fragment>
      }
      {(!loading && loggedIn && userRank > 2) &&
        <Button onClick={(e) => changeVotableStatus(e)}>Change active race voteable status</Button>
      }
      {(!loading && (!loggedIn || userRank < 2)) &&
        <div className="info">Nincs itt keresnivalód, irány a főoldal...</div>
      }
    </div>
  )
}

export default Admin;