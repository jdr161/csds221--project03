import { Navigate  } from "react-router-dom";
import { Component } from 'react';
import { Auth, API } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            navToHomepageBool: false,
            username: "",
            posts: []
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
        this.getPosts();
    }
    getPosts = async () => {
        // Simple query
        const allPosts = await API.graphql({ query: queries.listPosts });
        console.log(allPosts); // result: { "data": { "listTodos": { "items": [/* ..... */] } } }
        this.setState({posts: allPosts.data.listPosts.items});
    }
    handleSignoutClick = async () => {
        try {
            await Auth.signOut();
            this.setState({navToHomepageBool: true});
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    render() {
        return (
            <>
                <div>
                    Welcome to the dashboard
                </div>
                <div>
                    {this.state.posts.map(post => (<p key={post.id}>{post.content}</p>))} 
                </div>
            { this.state.navToHomepageBool &&
                <Navigate to="../" />
            }
            </>
        )
    }
}

export default Dashboard;