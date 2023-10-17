import { useState } from "react";
import { Auth } from 'aws-amplify';
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ConfirmSignUp from "./ConfirmSignUp";
import ForgotPassword from "./ForgotPassword";
import ForgotPasswordSubmit from "./ForgotPasswordSubmit";

async function signIn({ username, password }, setUser) {
  try {
    const user = await Auth.signIn(username, password);
    const userInfo = { username: user.username, ...user.attributes };
    setUser(userInfo);
  } catch (error) {
    console.log('error signing in...', error);
  }
}

async function signUp({ username, password, email }, updateFormType) {
  try {
    await Auth.signUp({ username, password, attributes: { email } });
    console.log('Sign Up success!');
    updateFormType('confirmSignUp');
  } catch (error) {
    console.log('error signing up...', error);
  }
}

async function confirmSignUp({ username, confirmationCode }, updateFormType) {
  try {
    await Auth.confirmSignUp(username, confirmationCode);
    console.log('Confirm Sign Up success!');
    updateFormType('signIn');
  } catch (error) {
    console.log('error confirming sign up...', error);
  }
}

async function forgotPassword({ username }, updateFormType) {
  try {
    await Auth.forgotPassword(username);
    console.log('Forgot password request success!');
    updateFormType('forgotPasswordSubmit');
  } catch (error) {
    console.log('error submitting username to reset password...', error);
  }
}

async function forgotPasswordSubmit({ username, confirmationCode, password }, updateFormType) {
  try {
    await Auth.forgotPasswordSubmit(username, confirmationCode, password);
    console.log('Update password success!');
    updateFormType('signIn');
  } catch (error) {
    console.log('error updating password...', error);
  }
}

const initialFormState = {
  username: '',
  password: '',
  email: '',
  confirmationCode: ''
};

function Form(props) {
  const [formType, updateFormType] = useState('signIn');
  const [formState, updateFormState] = useState(initialFormState);

  /**
   * The updateForm function will create a new state object using the
   * existing state as well as the new values coming in from the event and
   * then call updateFormState with this new form object.
   * We can then reuse this function across all of our components.
   * @param {*} event Event object for any form in the flow
   */
  function updateForm(event) {
    const newFormState = {
      ...formState,
      [event.target.name]: event.target.value
    };

    updateFormState(newFormState);
  }

  function renderForm() {
    switch (formType) {
      case 'signUp':
        return (
          <SignUp
            signUp={() => signUp(formState, updateFormType)}
            updateFormState={e => updateForm(e)}
          />
        );
      case 'confirmSignUp':
        return (
          <ConfirmSignUp
            confirmSignUp={() => confirmSignUp(formState, updateFormType)}
            updateFormState={e => updateForm(e)}
          />
        );
      case 'signIn':
        return (
          <SignIn
            signIn={() => signIn(formState, props.setUser)}
            updateFormState={e => updateForm(e)}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPassword
            forgotPassword={() => forgotPassword(formState, updateFormType)}
            updateFormState={e => updateForm(e)}
          />
        );
      case 'forgotPasswordSubmit':
        return (
          <ForgotPasswordSubmit
            forgotPasswordSubmit={() => forgotPasswordSubmit(formState, updateFormType)}
            updateFormState={e => updateForm(e)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div>
      {renderForm()}
      {
        formType === 'signUp' && (
          <p style={styles.toggleForm}>
            Already have an account? <span
              style={styles.anchor}
              onClick={() => updateFormType('signIn')}
            >Sign in</span>
          </p>
        )
      }
      {
        formType === 'signIn' && (
          <>
            <p style={styles.toggleForm}>
              Need an account?  <span
                style={styles.anchor}
                onClick={() => updateFormType('signUp')}
              >Sign Up</span>
            </p>
            <p style={{ ...styles.toggleForm, ...styles.resetPassword }}>
              Forgot your password? <span
                style={styles.anchor}
                onClick={() => updateFormType('forgotPassword')}
              >Reset Password</span>
            </p>
          </>
        )
      }
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: 45,
    marginTop: 8,
    width: 300,
    maxWidth: 300,
    padding: '0px 8px',
    fontSize: 16,
    outline: 'none',
    border: 'none',
    borderBottom: '2px solid rgba(0, 0, 0, .3)'
  },
  toggleForm: {
    fontWeight: '600',
    padding: '0px 25px',
    marginTop: '15px',
    marginBottom: 0,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.6)'
  },
  resetPassword: {
    marginTop: '5px',
  },
  anchor: {
    color: '#006bfc',
    cursor: 'pointer'
  }
};

export { styles, Form as default };
