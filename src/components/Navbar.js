import { Component } from 'react';
import bootstrap, { Button } from 'bootstrap';
import { Auth } from 'aws-amplify';
import { Navigate  } from "react-router-dom";


class Navbar extends Component {
    constructor(userAttributes) {
        super(userAttributes);
        this.state = {
            userAttributes: userAttributes,
            navToHomepageBool: false,
        };
        console.log(this.userAttributes);
    }

    handleSignoutClick = async () => {
        try {
            await Auth.signOut();
            this.setState({navToHomepageBool: true});
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }
    
    render (){
        return (
            <>
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <div className='container-fluid'>
                    <span className="navbar-text">
                        Hello {this.state.userAttributes.preferred_username}
                    </span>
                    <button className='btn btn-outline-danger' onClick={this.handleSignoutClick}>logout</button>
                </div>
            </nav>
            { this.state.navToHomepageBool &&
            <Navigate to="../" />
            }
            </>
        );
    }
}

export default Navbar;