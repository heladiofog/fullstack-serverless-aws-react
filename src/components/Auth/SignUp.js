import Button from './Butto';
import { styles } from './Form';

function SignUp({ updateFormState, signUp }) {
  return (
    <div style={styles.container}>
      <input
        name='username'
        onChange={e => { e.persist(); updateFormState(e); }}
        style={styles.input}
        placeholder='Username'
      />
      <input
        name='password'
        type='password'
        onChange={e => { e.persist(); updateFormState(e); }}
        style={styles.input}
        placeholder='Password'
      />
      <input
        name='email'
        onChange={e => { e.persist(); updateFormState(e); }}
        style={styles.input}
        placeholder='Email'
      />
      <Button onClick={signUp} title="Sign Up" />
    </div>
  );
}

export default SignUp;
