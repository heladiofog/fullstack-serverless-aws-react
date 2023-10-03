import Container from './Container';

function Public() {
  return (
    <Container>
      <h1>Public Route</h1>
      <p>
        This component simply renders the name of the route to the UI and can be accessed
        whether or not the user is signed in.<br/>
        In this component, you will use the Container component to add some padding and margin:
      </p>
    </Container>
  );
}

export default Public;