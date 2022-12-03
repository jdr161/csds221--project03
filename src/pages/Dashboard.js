import logo from '../logo.svg';
import '../App.css';
import { Navigate  } from "react-router-dom";
import { Component } from 'react';
import { Auth } from 'aws-amplify';

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            navToHomepageBool: false
        };
        Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then(user => {
            console.log(user);
            this.setState({
                username: user.attributes.preferred_username
            })
            })
        .catch(err => console.log(err));
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
                    Hello {this.state.username}
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