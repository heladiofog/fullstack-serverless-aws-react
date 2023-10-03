import { useEffect } from "react";
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
// import { createHashHistory } from "history";

const protectedRoute = (Comp, route='/profile') =>  (props) => {
  let navigate = useNavigate();
  // let history = createHashHistory();

  async function checkAuthState() {
    try {
      await Auth.currentAuthenticatedUser();
    } catch (error) {
      console.log("Error", error);
      // history.push(route); // With history, the component is actually displayed :(
      navigate(route);
    }
  }

  useEffect(() => {
    checkAuthState();
  }, []);

  return (<Comp {...props} />);
}

export default protectedRoute;
