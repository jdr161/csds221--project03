import logo from '../logo.svg';
import '../App.css';
import { Navigate  } from "react-router-dom";
import { Component } from 'react';

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            navToHomepageBool: false
        };
    }
    handleSignoutClick = () => {
        this.setState({navToHomepageBool: true});
        //log out of AWS Auth
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Hello
                    <button onClick={this.handleSignoutClick}>Sign out</button>
                    This is the Dashboard
                </p>
                </header>
                { this.state.navToHomepageBool &&
                    <Navigate to="../" />
                }
            </div>
        )
    }
}

export default Dashboard;