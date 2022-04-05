import logo from './logo.svg';
import './App.css';
import './index.scss';
import Races from './components/Races/Races';
import ListUsers from './components/ListUsers';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Vote from './components/Races/Vote';
import Admin from './components/Admin/Admin';
import RacePoints from './components/RacePoints/RacePoints';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { db } from './lib/init-firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import Settings from './components/Settings/Settings';

function App() {

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedRace, setSelectedRace] = useState();
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [races, setRaces] = useState([]);
  const [usersPoints, setUsersPoints] = useState([]);
  const [voted, setVoted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user !== null) {
      if (user.accessToken == (localStorage.getItem('token'))) {
        setLoggedIn(true);
      }
    }
  }, [user]);

  useEffect(() => {
    getDrivers();
    getRaces();
    getPointRace();
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      setUser(user);
    });
  }, []);

  const getPointRace = async () => {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('points2022', 'desc'));
    onSnapshot(q, (snapshot) => {
      let usersPointsList = [];
      snapshot.docs.forEach(doc => {
        usersPointsList.push({ name: doc.data().username, points: doc.data().points2022 });
      });
      setUsersPoints(usersPointsList);
    });
  }

  const getRaces = async () => {
    const racesRef = collection(db, 'races-datas/2022/races');
    const q = query(racesRef); 
    onSnapshot(q, (snapshot) => {
      let racesList = [];
      snapshot.docs.forEach(doc => {
        racesList.push({ ...doc.data(), id: doc.id });
      });
      racesList.sort((a, b) => { if (a.raceDate.seconds > b.raceDate.seconds) { return 1; } else { return -1; } });
      setRaces(racesList);
    });
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

  const loginUser = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        localStorage.setItem('token', user.accessToken);
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const logoutUser = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setUser(null);
      setLoggedIn(false);
      localStorage.removeItem('token');
    }).catch((error) => {
      // An error happened.
    });
  };

  const selectedRaceHandler = (race) => {
    navigate(`race/vote/${race.id}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Navbar user={user} loggedIn={loggedIn} logoutUser={logoutUser} />
      </header>
      <main>
      {voted &&
        <div className="information">
          <div className=" access">You voted successfully</div>
        </div>
      }
        <Routes>
          <Route exact path='/' element={<Races races={races} drivers={drivers} isLoading={isLoading} user={user} loggedIn={loggedIn} selectedRaceHandler={selectedRaceHandler} />} />
          <Route exact path='/login' element={<Login loginUser={loginUser} loggedIn={loggedIn} />} />
          <Route exact path='/point-race' element={<RacePoints usersPoints={usersPoints} loggedIn={loggedIn} />} />
          <Route exact path='/race/vote/:id' element={<Vote user={user} drivers={drivers} loggedIn={loggedIn} />} />
          {/*<Route exact path='/uploaddriverstorace' element={<ListUsers />} />*/}
          <Route exact path='/changemymindifyouwant' element={<Admin user={user} loggedIn={loggedIn} races={races} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
