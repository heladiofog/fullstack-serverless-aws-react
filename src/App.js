import { useEffect, useReducer } from 'react';
// Import the API category from AWS Amplify
import { API } from 'aws-amplify';
import { List } from 'antd';
// import 'antd/dist/antd.css'; // Not necessary nowadays(2023)
import { listNotes } from './graphql/queries';
import './App.css';

// Initial state to be used with the reducer
const initialState = {
  notes: [],
  loading: true,
  error: false,
  form: { name: '', description: '' }
};
// reducer function
function reducer(state, action) {
  switch(action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.notes, loading: false };
    case 'ERROR':
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
}
// Styles for the component
const styles = {
  container: { padding: 20 },
  input: { marginBottom: 10 },
  item: { textAlign: 'left' },
  p: { color: '#1880ff' },
};

function App({ signOut, user }) {
  // reducer hook to manage state and dispatch function
  const [state, dispatch] = useReducer(reducer,initialState);
  // Create fetchNotes function to fetch the notes
  async function fetchNotes() {
    try {
      const notesData = await API.graphql({
        query: listNotes
      });
      dispatch({ type: 'SET_NOTES', notes: notesData.data.listNotes.items });
    } catch (error) {
      console.log('error: ', error);
      dispatch({ type: 'ERROR' })
    }
  }
  // Invoque the fetchNotes by implementing the useEffect hook
  useEffect(() => {
    fetchNotes();
  }, []);

  // Define the renderItem function
  function renderItem(item) {
    return (
      <List.Item style={styles.item}>
        <List.Item.Meta
          title={item.name}
          description={item.description}
        />
      </List.Item>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Notes App</h1>
      </header>
      <main style={styles.container}>
        <List
          loading={state.loading}
          dataSource={state.notes}
          renderItem={renderItem}
        />
      </main>
    </div>
  );
}

export default App;
