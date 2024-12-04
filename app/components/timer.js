import { useState, useEffect } from 'react';

export default function Timer({duration}) {
  const [seconds, setSeconds] = useState(duration); // Initial time (5 minutes = 300 seconds)

  useEffect(() => {
    // Start a timer that updates every second
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval); // Stop the timer when it reaches 0
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Convert seconds into minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="timer text-right p-4">
      <h1 className="text-2xl font-bold">
         {minutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
      </h1>
    </div>
  );
}
