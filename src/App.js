// import { withAuthenticator } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
// Import the API category from AWS Amplify
import { API } from 'aws-amplify';
import './App.css';
// import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  const [coins, updateCoins] = useState([]);
  
  // Define function to all API
  async function fetchCoins() {
    const data = await API.get('cryptoapi', '/coins');
    updateCoins(data.coins);
  }

  // Call fetchCoins function when component loads
  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {
          coins.map((coin, index) => (
            <div key={index}>
              <h2>{coin.name} - {coin.symbol}</h2>
              <h5>${coin.price_usd} USD</h5>
            </div>
          ))
        }
      </header>
    </div>
  );
}

export default App;
