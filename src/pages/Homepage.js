import { Navigate  } from "react-router-dom";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';



const Homepage = () => {
  return (
    <>
      
      <Authenticator variation="modal">
          {() => (
            <main>
              <Navigate to="/dashboard" />
            </main>
          )}
        </Authenticator>
    </>
  )
};

export default Homepage;