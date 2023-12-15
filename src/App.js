// import Router from './components/Router';
import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import './App.css';

function App({ signOut }) {
  const [user, updateUser] = useState(null);
  console.log({user});

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(err => console.log("Error validating authenticated user", err));
  }, []);

  let isAdmin = false;

  if (user) {
    const { signInUserSession: { idToken: { payload } } } = user;
    console.log('payload: ', payload);
    if (payload['cognito:groups'] && payload['cognito:groups'].includes('Admin')) {
      isAdmin = true;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Basich Authentication App - Ch04</h1>
        { isAdmin && <p>Welcome, Admin!</p> }
      </header>
      {/* <Router /> */}
      <h2>Hello {user?.username}</h2>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(App);
