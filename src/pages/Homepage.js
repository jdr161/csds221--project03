import logo from '../logo.svg';
import '../App.css';

const Homepage = () => {
  return (
    <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
            This is the Homepage
        </p>
        </header>
    </div>
  )
};

export default Homepage;