import React, { useEffect, useState } from 'react';
import Races from './Races/Races';
import { collection, getDocs, addDoc, query, doc, onSnapshot, where, updateDoc, getDoc} from 'firebase/firestore';
import { db } from '../lib/init-firebase';
import { async } from '@firebase/util';

const ListUsers = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    getDrivers();
    setDriversToRace();
  }, [])

  const setDriversToRace = async () => {
    const raceDocRef = doc(db, 'races-datas/2022/races', /* RACE ID-T IDE ÍRD */ 'Nisj9qkLpHRkNly0Uy7j');
    let driverNumbers = [];
    console.log('hi');
    drivers.map(driver => {
      /* HA KI KELL HAGYNI VERSENYZŐT, MÁRPEDIG KI KELL A HELYETTESÍTÉS MIATT, AKKOR ITT ADD MEG, HOGY KIT KELL KIHAGYNI*/
      if (driver.number !== 27) {
        driverNumbers.push(driver.number);
      }
    });
    updateDoc(raceDocRef, { drivers: driverNumbers });
  }

  const getDrivers = async () => {
    const driversRef = collection(db, 'races-datas/2022/drivers');
    const q = query(driversRef); 
    onSnapshot(q, (snapshot) => {
      let driversList = [];
      snapshot.docs.forEach(doc => {
        driversList.push({ ...doc.data(), id: doc.id });
      });
      setDrivers(driversList);
    });
    setIsLoading(false);
  }

  const addRace = async () => {
    const racesRef = collection(db, 'races-datas/2022/drivers');
    const race = {
      name: 'Nico Hülkenberg',
      nationality: 'Germany',
      team: 'Aston Martin',
      number: 27
    }
    addDoc(racesRef, race);
    console.log('Futam hozzáadva, dátumot állítsd be');
  }

  return (
    <div>
      <Races />
      <button onClick={() => setDriversToRace()}>Verseny hozzáadása</button>
    </div>
  )
}

export default ListUsers;