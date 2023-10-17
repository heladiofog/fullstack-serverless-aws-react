import Button from './Button';
import { styles } from './Form';

function SignIn({ updateFormState, signIn }) {
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
      <Button onClick={signIn} title="Sign In" />
    </div>
  );
}

export default SignIn;
