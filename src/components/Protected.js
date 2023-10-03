import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Container from './Container';

import { createHashHistory } from "history";
let history = createHashHistory();

function Protected(props) {
  const navigate = useNavigate();
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .catch((error) => {
        // The user is not singned in, redirect him
        console.log("Error", error);
        console.log(navigate);
        // navigate('/profile');
        history.push('/profile');
      });
  }, []);
  
  return (
    <Container>
      <h1>Protected Route</h1>
      <p>Private Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem quo optio recusandae possimus voluptatum itaque, eligendi beatae nulla explicabo. Consequuntur veritatis consequatur minima ullam veniam quas voluptates error itaque assumenda!</p>
    </Container>
  );
}

export default Protected;