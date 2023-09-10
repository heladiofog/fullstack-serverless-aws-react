import { useEffect, useReducer } from 'react';
// Import the API category from AWS Amplify
import { API } from 'aws-amplify';
// Import the AntDesign components and uuid
import { List, Input, Button } from 'antd';
// import 'antd/dist/antd.css'; // Not necessary nowadays(2023)
import { v4 as uuid } from 'uuid';
import { listNotes } from './graphql/queries';
import {
  createNote as CreateNote,
  updateNote as UpdateNote,
  deleteNote as DeleteNote,
 } from './graphql/mutations';
import { onCreateNote } from './graphql/subscriptions';
import './App.css';

// UUID
const CLIENT_ID = uuid();
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
      // console.log(action.notes);
      return { ...state, notes: action.notes, loading: false };
    case 'ADD_NOTE':
      return { ...state, notes: [action.note, ...state.notes] };
    case 'RESET_FORM':
      return { ...state, form: initialState.form };
    case 'SET_INPUT':
      // updating the form state when user types
      return { ...state, form: { ...state.form, [action.name]: action.value } };
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

  // Create Note
  async function createNote() {
    const { form } = state;

    if (!form.name || !form.description) {
      return alert('please enter a name and a description');
    }

    const note = { ...form, clientId: CLIENT_ID, completed: false, id: uuid() };
    dispatch({ type: 'ADD_NOTE', note }); // state update first, Optimistic response
    dispatch({ type: 'RESET_FORM' });
    try {
      await API.graphql({
        query: CreateNote,
        variables: { input: note }
      });
      console.log('Successfully created note!');
    } catch (error) {
      console.log('Error:', error);
      // Hypothetically you should be able to refresh the state and manage the error accordingly
    }
  }
  // Update a Note
  async function updateNote(updatedNote) {
    const noteIndex = state.notes.findIndex(note => note.id === updatedNote.id);
    const notes = [...state.notes];
    notes[noteIndex].completed = !updatedNote.completed;
    // update first local state
    dispatch({ type: 'SET_NOTES', notes});
    // Now update the remote data
    try {
      await API.graphql({
        query: UpdateNote,
        variables: {
          input: {
            id: updatedNote.id,
            completed: notes[noteIndex].completed
          }
        }
      });
      console.log('Note successfully updated!');
    } catch (error) {
      console.log('Error:', error);
    }
  }

  // Delete a note
  async function deleteNote({ id }) {
    const noteIndex = state.notes.findIndex(note => note.id === id);
    // local state update
    const updatedNotes = [
      ...state.notes.slice(0, noteIndex),
      ...state.notes.slice(noteIndex + 1)
    ];
    dispatch({ type: 'SET_NOTES', notes: updatedNotes });
    // remote data update
    try {
      await API.graphql({
        query: DeleteNote,
        variables: { input: { id } }
      });
      console.log('Successfully deleted note!');
    } catch (error) {
      console.log({ error });
    }
  }

  // Invoque the fetchNotes by implementing the useEffect hook
  useEffect(() => {
    fetchNotes();
    // To implement subscription to the create event...
    // based on the book and 
    // https://docs.amplify.aws/lib/graphqlapi/subscribe-data/q/platform/js/
    const subscription = API.graphql({
      query: onCreateNote
    })
      .subscribe({
        next: noteData => {
          console.log({ noteData });
          // From amplify docs:
          // ({ provider, value }) => console.log({ provider, value }),
          const note = noteData.value.data.onCreateNote;
          // if the user is the producer of the event...just ignore it
          if (CLIENT_ID === note.clientId)
            return;
          // else, dispatch the update reducer's action with the note received
          console.log("I did not created the note: " + note.name);
          dispatch({ type: 'ADD_NOTE', note });
        },
        error: (error) => console.warn(error)
      });
    // Close the subscription
    return () => subscription.unsubscribe();
  }, []);

  // Define the renderItem function
  function renderItem(item) {
    return (
      <List.Item
        style={styles.item}
        actions={[
          <a style={styles.p} onClick={() => deleteNote(item)}>Delete</a>,
          <a style={styles.p} onClick={() => updateNote(item)}>
            {item.completed ? 'completed': 'mark completed'}
          </a>,
        ]}
      >
        <List.Item.Meta
          title={item.name}
          description={item.description}
        />
      </List.Item>
    );
  }

  /**
   * To uppdate the form state when user interacts with an input
   */
  function onChange(e) {
    dispatch({ type: 'SET_INPUT', name: e.target.name, value: e.target.value });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Notes App</h1>
      </header>
      <main style={styles.container}>
        <Input
          onChange={onChange}
          value={state.form.name}
          placeholder='Note Name'
          name='name'
          style={styles.input}
        />
        <Input
          onChange={onChange}
          value={state.form.description}
          placeholder='Note Description'
          name='description'
          style={styles.input}
        />
        <Button
          onClick={createNote}
          type='primary'
        >
          Create Note
        </Button>
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
