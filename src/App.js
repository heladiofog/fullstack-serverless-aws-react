// import { withAuthenticator } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
// Import the API category from AWS Amplify
import { API } from 'aws-amplify';
import './App.css';
// import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  // coins variable and its update function
  const [coins, updateCoins] = useState([]);
  // Create additional state to hold user input for limit and start properties
  const [input, updateInput] = useState({ limit: 5, start: 0 });

  // Create a new function to allow users to update the input values
  function updateInputValues(type, value) {
    updateInput({ ...input, [type]: value });
  }

  // Update fetchCoins function to use limit and start properties
  async function fetchCoins() {
    const { limit, start } = input;
    const data = await API.get('cryptoapi', `/coins?limit=${limit}&start=${start}`);
    updateCoins(data.coins);
  }

  // Call fetchCoins function when component loads
  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* Add input fields to the UI for user input */}
        <div>
          <input
            onChange={e => updateInputValues('limit', e.target.value)}
            placeholder="limit"
          />
        </div>
        <div>
          <input
            onChange={e => updateInputValues('start', e.target.value)}
            placeholder="start"
          />
        </div>
        {/* Add button to the UI to give user the option rto call the APi */}
        <div><button onClick={fetchCoins}>Fetch Coins</button></div>
      </header>
      {
        coins.map((coin, index) => (
          <div key={index}>
            <h2>{coin.name} - {coin.symbol}</h2>
            <h5>${coin.price_usd} USD</h5>
          </div>
        ))
      }
    </div>
  );
}

export default App;
