import { useState, useEffect } from "react";
import { Button } from 'antd';
import { Auth, Hub } from 'aws-amplify';
/*
import {
  withAuthenticator,
  // AmplifySignOut // as detailed on Aplify 2023 docs
} from "@aws-amplify/ui-react";
*/
import '@aws-amplify/ui-react/styles.css';
import Container from "./Container";
import Form from './Auth/Form';

function Profile() {
  useEffect(() => {
    checkUser();
    Hub.listen('auth', (data) => {
      const { payload } = data;
      if (payload.event === 'signOut') {
        setUser(null);
      }
    });
  }, []);

  const [user, setUser] = useState(null);

  async function checkUser() {
    try {
      const data = await Auth.currentUserPoolUser();
      console.log(data);
      const userInfo = {
        username: data.username,
        ...data.attributes,
      };
      setUser(userInfo);
    } catch (error) {
      console.log("Error retrieving user info: ", error);
    }
  }

  function signOut() {
    Auth.signOut().catch(err => console.log('error signing out: ', err));
  }

  // Conditional render based on auth state of the user
  if (user) {
    return (
      <Container>
        <h1>Profile</h1>
        <h2>Username: {user.username}</h2>
        <h3>Email: {user.email}</h3>
        <h3>Phone: {user.phone_number}</h3>
        <Button onClick={signOut}>Sign out</Button>
      </Container>
    );
  }
  
  return <Form setUser={setUser} />
}

export default Profile;
