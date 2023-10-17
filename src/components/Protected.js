import Container from './Container';
import protectedRoute from './ProtectedRoute';

function Protected(props) {
  return (
    <Container>
      <h1>Protected Route</h1>
      <p>Private Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem quo optio recusandae possimus voluptatum itaque, eligendi beatae nulla explicabo. Consequuntur veritatis consequatur minima ullam veniam quas voluptates error itaque assumenda!</p>
    </Container>
  );
}

export default protectedRoute(Protected);
