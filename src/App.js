import { withAuthenticator } from '@aws-amplify/ui-react';
import { List, Input, Button } from 'antd';
// import 'antd/dist/antd.css'; // Not necessary nowadays(Sept.2023)
import Container from './components/Container';
import './App.css';

// Styles for the component
const styles = {
  container: { padding: 20 },
  input: { marginBottom: 10 },
  item: { textAlign: 'left' },
  p: { color: '#1880ff' },
};

function App({ signOut, user }) {

  return (
    <div className="App">
      <header className="App-header">
        <h1>Basich Authentication App - Ch04</h1>
      </header>
      <Container style={styles.container}>
        <h1>Hallo!</h1>
      </Container>
    </div>
  );
}

export default withAuthenticator(App);
