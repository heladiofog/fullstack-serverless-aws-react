import { Auth } from 'aws-amplify';
import Container from './Container';
import { useEffect } from 'react';

function Protected(props) {
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .catch((error) => {
        // Thhe user is not singned in, redirect him
        console.log("Error", error);
        props.history.push('/profile');
      });
  }, []);
  
  return (
    <Container>
      <h1>Protected Route</h1>
    </Container>
  );
}

export default Protected;