import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './JokeWidget.css'; 
const JokeWidget: React.FC = () => {
  const [joke, setJoke] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
        if (response.data.type === 'single') {
          setJoke(response.data.joke);
        } else {
          setJoke(`${response.data.setup} - ${response.data.delivery}`);
        }
      } catch (error) {
        setError('Failed to fetch joke');
      }
    };

    fetchJoke();
  }, []);

  return (
    <div className="joke-widget">
      <p>Here's a joke for you:</p>
      {error ? <p>{error}</p> : <p>{joke}</p>}
    </div>
  );
};

export default JokeWidget;
