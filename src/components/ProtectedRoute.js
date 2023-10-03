import { useEffect } from "react";
import { Auth } from 'aws-amplify';
import { createHashHistory } from "history";
let history = createHashHistory();

const protectedRoute = (Comp, route='/profile') => {
  async function checkAuthState() {
    try {
      await Auth.currentAuthenticatedUser();
    } catch (error) {
      console.log("Error", error);
      history.push(route);
    }
  }

  useEffect(() => {
    checkAuthState();
  }, []);

  return (<Comp {...props} />);
}

export default protectedRoute;
