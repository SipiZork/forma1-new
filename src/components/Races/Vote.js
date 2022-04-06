import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDateFormTimestamp } from '../../utils/dateUtils';
import { getDoc, updateDoc, doc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/init-firebase';
import Button from '../Button/Button';

const Vote = ({ user, drivers }) => {
  const [formData, setFormData] = useState({
    first: '1',
    second: '1',
    third: '1',
    fastestLap: '1'
  });
  const [votes, setVotes] = useState([]);
  const [race, setRace] = useState(undefined);
  const [peopleVotes, setPeopleVotes] = useState([]);
  const [voteExists, setVoteExists] = useState(false);
  const [driversNumbers, setDriversNumbers] = useState(undefined);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getVotes();
  }, []);

  useEffect(() => {
    getDriversVote2();
    const voteExists = votes.some(vote => vote.user === user.uid);
    if (voteExists) {
      const vote = votes.find(vote => vote.user === user.uid);
      setVoteExists(true);
      setFormData({
        first: vote.first,
        second: vote.second,
        third: vote.third,
        fastestLap: vote.fastestLap
      });
    }
    
  }, [votes]);

  
  const sortArray = ({ array, direction = 'asc' }) => {
    if (direction === 'asc') {
      return array.sort((a, b) => { if (a > b) { return 1; } else { return -1; } });
    } else {
      return array.sort((a, b) => { if (a > b) { return -1; } else { return 1; } });
    }    
  }

  const inputChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const getVotes = async() => {
    const raceRef = doc(db, 'races-datas/2022/races', params.id);
    const q = query(raceRef);
    onSnapshot(q, (snapshot) => {
      setVotes(snapshot.data().votes);
      setRace(snapshot.data());
      setDriversNumbers(sortArray({ array: snapshot.data().drivers }));
    })
  }

  const voteToRace = (e) => {
    e.preventDefault();
    const raceRef = doc(db, 'races-datas/2022/races', params.id);
    if (voteExists) {
      votes.map(vote => {
        if (vote.user === user.uid) {
          vote.first = parseInt(formData.first);
          vote.second = parseInt(formData.second);
          vote.third = parseInt(formData.third);
          vote.fastestLap = parseInt(formData.fastestLap);
        }
      });
    } else {
      votes.push({
        first: parseInt(formData.first),
        second: parseInt(formData.second),
        third: parseInt(formData.first),
        fastestLap: parseInt(formData.first),
        user: user.uid
      })
    }
    updateDoc(raceRef, { votes });
  }

  const getDriversVote = (driverNumber, driverName, i) => {
    if (votes.some(vote => vote.first === driverNumber || vote.second === driverNumber || vote.third === driverNumber || vote.fastestLap === driverNumber)) {
      const first = race.votes.filter(vote => driverNumber === vote.first);
      const second = race.votes.filter(vote => driverNumber === vote.second);
      const third = race.votes.filter(vote => driverNumber === vote.third);
      const fastestLap = race.votes.filter(vote => driverNumber === vote.fastestLap);
      return (
        <Fragment key={i}>
          <div>{driverName}</div>
          <div>{first.length}</div>
          <div>{second.length}</div>
          <div>{third.length}</div>
          <div>{fastestLap.length}</div>
        </Fragment>
      );
    }
  }

  const getDriversVote2 = () => {
    setPeopleVotes([]);
    votes.map(async (vote) => {
      const userRef = doc(db, 'users', vote.user);
      const userSnap = await getDoc(userRef);
      const first = drivers.find(driver => driver.number === vote.first).name;
      const second = drivers.find(driver => driver.number === vote.second).name;
      const third = drivers.find(driver => driver.number === vote.third).name;
      const fastestLap = drivers.find(driver => driver.number === vote.fastestLap).name;

      setPeopleVotes(peopleVotes => [
        ...peopleVotes,
        {
          first,
          second,
          third,
          fastestLap,
          username: userSnap.data().username
        }
      ])
    });
  }

  return (
    <div className="vote">
      {(race && race !== null) &&
        <Fragment>
        <div className='vote-it'>
          <div className="info">
            <h4 className="race-name">{race.name}</h4>
            <h5>{getDateFormTimestamp(race.raceDate.seconds)}</h5>
            </div>
            {race.voteable &&
              <form className='vote-form'>
                <div className="input-group">
                  <label>First Place</label>
                  <select type="text" name="first" value={formData.first} onChange={(e) => inputChangeHandler(e)}>
                    {driversNumbers && driversNumbers.map((driverNumber, i) => {
                      const actualDriver = drivers.find(driver => driver.number === driverNumber);
                      return (
                        <option value={actualDriver.number} key={i}>{actualDriver.name}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="input-group">
                  <label>Second Place</label>
                  <select type="text" name="second" value={formData.second} onChange={(e) => inputChangeHandler(e)}>
                    {driversNumbers && driversNumbers.map((driverNumber, i) => {
                      const actualDriver = drivers.find(driver => driver.number === driverNumber);
                      return (
                        <option value={actualDriver.number} key={i}>{actualDriver.name}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="input-group">
                  <label>Third Place</label>
                  <select type="text" name="third" value={formData.third} onChange={(e) => inputChangeHandler(e)}>
                    {driversNumbers && driversNumbers.map((driverNumber, i) => {
                      const actualDriver = drivers.find(driver => driver.number === driverNumber);
                      return (
                        <option value={actualDriver.number} key={i}>{actualDriver.name}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="input-group">
                  <label>Fastest Lap</label>
                  <select type="text" name="fastestLap" value={formData.fastestLap} onChange={(e) => inputChangeHandler(e)}>
                    {driversNumbers && driversNumbers.map((driverNumber, i) => {
                      const actualDriver = drivers.find(driver => driver.number === driverNumber);
                      return (
                        <option value={actualDriver.number} key={i}>{actualDriver.name}</option>
                      );
                    })}
                  </select>
                </div>
                <Button onClick={(e) => voteToRace(e)}>{voteExists ? 'Change My Vote' : 'Vote'}</Button>
              </form>
            }
        </div>
          <div className="drivers-votes">
            <div className='text-bold'>Racer</div>
            <div className='text-bold'>First Place</div>
            <div className='text-bold'>Second Place</div>
            <div className='text-bold'>Third Place</div>
            <div className='text-bold'>Fastest Lap</div>
            {drivers.map((driver, i) => (getDriversVote(driver.number, driver.name, i)))}
          </div>
          <div className="drivers-votes">
            <div className='text-bold'>Voter</div>
            <div className='text-bold'>First Place</div>
            <div className='text-bold'>Second Place</div>
            <div className='text-bold'>Third Place</div>
            <div className='text-bold'>Fastest Lap</div>
            {peopleVotes.map((vote, i) => {
              console.log(vote);
              return (
                <Fragment key={i}>
                  <div>{vote.username}</div>
                  <div>{vote.first}</div>
                  <div>{vote.second}</div>
                  <div>{vote.third}</div>
                  <div>{vote.fastestLap}</div>
                </Fragment>
              );
            })
          }
          </div>
        </Fragment>
      }
    </div>
  )
}

export default Vote;