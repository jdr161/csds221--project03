import logo from '../logo.svg';
import '../App.css';
import { Navigate  } from "react-router-dom";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';



const Homepage = () => {
  return (
    <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
            This is the Homepage
        </p>
        <Authenticator>
          {() => (
            <main>
              <Navigate to="/dashboard" />
            </main>
          )}
        </Authenticator>
        </header>
    </div>
  )
};

export default Homepage;