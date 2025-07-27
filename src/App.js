import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [inputTime, setInputTime] = useState(25);
  const [mode, setMode] = useState('work');

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  }

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? inputTime * 60 : 5 * 60);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            clearInterval(intervalRef.current);

            if (mode === 'work') {
              setMode('break');
              setTimeLeft(5 * 60);
              setIsRunning(true);
            } else {
              setMode('work');
              setTimeLeft(inputTime * 60);
              setIsRunning(false);
            }

            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);


  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(inputTime * 60);
    }
  }, [inputTime]);

  return (
    <div className="App">
      <h1>PomoSmiski</h1>
      <div class="middle">
        <div class="timer">
          <h2 class="mode">{mode === 'work' ? 'Work Time' : 'Break Time'}</h2>
          <h2>{formatTime(timeLeft)}</h2>
        </div>
        <img src={mode === 'work' ? '/worksmiski.png' : '/chillsmiski.png'} />
      </div>
      <label>
        Choose duration:
        <select
          value={inputTime}
          onChange={(e) => setInputTime(Number(e.target.value))}
          disabled={isRunning} // disable while running so user can't change mid-session
        >
          <option value={15}>15 minutes</option>
          <option value={20}>20 minutes</option>
          <option value={25}>25 minutes</option>
          <option value={30}>30 minutes</option>
        </select>
      </label>
      <div class="buttons">
        <button onClick={handleStartPause}>
          <img
            src={isRunning ? '/pause.png' : '/start.png'}
            alt={isRunning ? 'Pause' : 'Start'}
          />
        </button>

        <button onClick={handleReset}>
          <img src={'/reset.png'} />
        </button>
      </div>
    </div>
  );
}

export default App;
