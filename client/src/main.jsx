import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

const App = ()=> {
  const [flavors, setFlavors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    const fetchflavors = async()=> {
      const response = await axios.get('/api/flavors');
      setFlavors(response.data);
      setIsLoading(false);
    };
    fetchflavors();
  }, []);

  if(isLoading){
    return <section className='loading'>Loading</section>
  }

  return (
    <main>
      <h1>Ice Cream Shop ({ flavors.length })</h1>
      <h2>Flavor</h2>
      <ul>
        {
          flavors.map( flavor => {
            return (
              <li key={ flavor.id }>
                { flavor.name }
                {
                  flavor.is_favorite ? <span style={{ paddingLeft: '5rem' }}>Favorite</span>: null
                }
              </li>
            );
          })
        }
      </ul>
    </main>
  );
};

const root = createRoot(document.querySelector('#root'));

root.render(<App />);
