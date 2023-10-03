import { useState, useEffect } from "react";
import { Auth  } from 'aws-amplify';
import {
  withAuthenticator,
  // AmplifySignOut
} from "@aws-amplify/ui-react";
import Container from "./Container";

function Profile({ signOut }) {
  useEffect(() => {
    checkUser();
  });

  const [user, setUser] = useState({});

  async function checkUser() {
    try {
      const data = await Auth.currentUserPoolUser();
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
