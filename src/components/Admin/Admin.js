import React, { useEffect, useState } from 'react';
import { db } from '../../lib/init-firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Button from '../Button/Button';


const Admin = ({ loggedIn, user, races }) => {

  const [userRank, setUserRank] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserRank();
  }, [user])

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
    if (actualRace.votes > 0) {
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

  return (
    <div className='admin'>
      {(loggedIn && userRank > 10) ?
        <Button onClick={(e) => addPoints(e)}>Add points and Close Race</Button>
        : loading ? <div>Töltés...</div> : <div>Nincs jogosultságod ehhez az oldalhoz</div>
      }
    </div>
  )
}

export default Admin;