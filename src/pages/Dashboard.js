import { Navigate  } from "react-router-dom";
import { Component } from 'react';
import { Auth, API } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import Navbar from "../components/Navbar";


class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            navToHomepageBool: false,
            userAttributes: {
                email: "",
                email_verified: false,
                preferred_username: "",
                sub: ""
            },
            posts: [],
            newPostContent: ""
        };
        Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then(user => { //If the user is authenticated, then we want to get the posts and user info
            //console.log(user);
            this.getPosts();
            this.getUser();
            })
        .catch(err => { //If the user is not authenticated, we just return to the homepage
            console.log(err);
            this.setState({navToHomepageBool: true});
        });
    }
    getPosts = async () => {
        // Simple query
        const allPosts = await API.graphql({ query: queries.listPosts });
        console.log(allPosts); // result: { "data": { "listTodos": { "items": [/* ..... */] } } }
        this.setState({posts: allPosts.data.listPosts.items});
    }
    getUser = async () => {
        const { attributes } = await Auth.currentAuthenticatedUser();
        this.setState({userAttributes: attributes});
    }
    handleSignoutClick = async () => {
        try {
            await Auth.signOut();
            this.setState({navToHomepageBool: true});
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }
    handleCreateNewPost = async () => {
        console.log("reached");
        const postDetails = {
            username: this.state.userAttributes.preferred_username,
            content: this.state.newPostContent
        };
        console.log(postDetails);
        await API.graphql({ query: mutations.createPost, variables: {input: postDetails}});
    }
    handleChange = (event) => {
        this.setState({newPostContent: event.target.value});
      }

    render() {
        return (
            <>
                <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                    <div className='container-fluid'>
                        <span className="navbar-text">
                            Welcome back {this.state.userAttributes.preferred_username}!
                        </span>
                        <div className='d-flex'>
                            <button className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#newPostModal">New Post</button>
                            <button className='btn btn-outline-danger' onClick={this.handleSignoutClick}>Logout</button>
                        </div>
                    </div>
                </nav>
                <div>
                    Welcome to the dashboard
                </div>
                <div>
                    {this.state.posts.map(post => (<p key={post.id}>{post.content}</p>))} 
                </div>

                {/* Create New Post Modal */}
                <div className="modal fade" id="newPostModal" tabIndex="-1" aria-labelledby="newPostModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                <form onSubmit={this.handleCreateNewPost}>
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="newPostModalHeader">New Post</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="mb-3">
                            <label htmlFor="postText" className="form-label">Say Something...</label>
                            <input type="text" value={this.state.newPostContent} onChange={this.handleChange} className="form-control" id="postText"/>
                        </div>
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary">Post</button>
                    </div>
                    </div>
                </form>
                </div>
                </div>
            { this.state.navToHomepageBool &&
                <Navigate to="../" />
            }
            
            </>
        )
    }
}

export default Dashboard;