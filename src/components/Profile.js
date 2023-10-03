import { useState, useEffect } from "react";
import { Auth } from 'aws-amplify';
import {
  withAuthenticator,
  // AmplifySignOut // as detailed on Aplify 2023 docs
} from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import Container from "./Container";

function Profile({ signOut }) {
  useEffect(() => {
    checkUser();
  }, []);

  const [user, setUser] = useState({});

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
      console.log("Error retrieveing user info: ", error);
    }
  }

  return (
    <Container>
      <h1>Profile</h1>
      <h2>Username: {user.username}</h2>
      <h3>Email: {user.email}</h3>
      <h3>Phone: {user.phone_number}</h3>
      {/* <AmplifySignOut /> */}
      <button onClick={signOut}>Sign out</button>
    </Container>
  );
}

export default withAuthenticator(Profile);
