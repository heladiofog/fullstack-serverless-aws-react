import Router from './components/Router';
import './App.css';

function App({ signOut, user }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Basich Authentication App - Ch04</h1>
      </header>
      <Router />
    </div>
  );
}

export default App;
