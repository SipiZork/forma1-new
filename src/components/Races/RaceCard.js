import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { getDateFormTimestamp } from '../../utils/dateUtils';
import Button from '../Button/Button';
const RaceCard = ({ race, loggedIn, drivers, selectedRaceHandler }) => {

  const getDriver = (number) => {
    const driver = drivers.find(driver => driver.number === number);
    return driver.name;
  }

  const setRace = (race) => {
    selectedRaceHandler(race);
  }

  return (
    <div className='race-card'>
      <div className="infos">
        {(race.end || race.active) &&
          <div className={`marker${race.end ? ' end' : race.active ? ' active' : ''}`}></div>
        }
        <div className="location">{race.name}</div>
        {race.raceDate &&
          <div className="date">{getDateFormTimestamp(race.raceDate.seconds)}</div>
        }
      </div>
      {race.end &&
        <div className="winners">
          <div className="driver"><span>1.</span><p>{getDriver(race.winners.first)}</p></div>
          <div className="driver"><span>2.</span><p>{getDriver(race.winners.second)}</p></div>
          <div className="driver"><span>3.</span><p>{getDriver(race.winners.third)}</p></div>
          <div className="driver"><span><FontAwesomeIcon icon={faClock} /></span><p>{getDriver(race.winners.fastestLap)}</p></div>
        </div>
      }
      {(!race.end && race.active && loggedIn) &&
        <div className="actions">
          <Button onClick={() => setRace(race)}>{race.voteable ? 'Vote' : 'Watch votes'}</Button>
        </div>
      }
    </div>
  )
}

export default RaceCard;