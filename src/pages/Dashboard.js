import { Navigate  } from "react-router-dom";
import { Component } from 'react';
import { Auth, API } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import moment from "moment/moment";
import toast, { Toaster } from 'react-hot-toast';


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
            newPostContent: "",
            updatedPostContent: "",
            postToUpdateId: "",
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
        const allPosts = await API.graphql({ query: queries.postsByDate, variables: {type: "Post", sortDirection: "DESC"} });
        console.log(allPosts); // result: { "data": { "listTodos": { "items": [/* ..... */] } } }
        this.setState({posts: allPosts.data.postsByDate.items});
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
        if(this.state.newPostContent !== ""){
            const postDetails = {
                username: this.state.userAttributes.preferred_username,
                content: this.state.newPostContent,
                type: "Post" //This is necessary for sorting with AppSync
            };
            console.log(postDetails);
            await API.graphql({ query: mutations.createPost, variables: {input: postDetails}}).then(toast.success("Post successfully created!"));
        } else {
            toast.error("Posts cannot be empty");
        }
    }
    handleChange = (event) => {
        this.setState({newPostContent: event.target.value});
      }
    handleDeletePost = async (id) => {
        const postDetails = {
            id: id,
        };
        const deletedPost = await API.graphql({ query: mutations.deletePost, variables: {input: postDetails}});
        this.getPosts();
        toast.success("Post successfully deleted!");
    }
    handleUpdatePost = async () => {
        const postDetails = {
            id: this.state.postToUpdateId,
            username: this.state.userAttributes.preferred_username,
            content: this.state.updatedPostContent,
            type: "Post" //This is necessary for sorting with AppSync
        };
        console.log(postDetails);
        await API.graphql({ query: mutations.updatePost, variables: {input: postDetails}}).then(toast.success("Post successfully updated!"));
    }
    handleEditChange = (event) => {
        this.setState({updatedPostContent: event.target.value});
    }
    setPostToUpdate = (id, content) => {
        this.setState({postToUpdateId: id});
        this.setState({updatedPostContent: content});
    }

    render() {
        return (
            <>
                <Toaster
                position="bottom-right"
                reverseOrder={false}
                />
                <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    Welcome back {this.state.userAttributes.preferred_username}!
                    <div className="d-flex">
                        <span className="navbar-brand h1">Project 03: Posting App</span>
                    </div>
                    <div className='d-flex'>
                        <button className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#newPostModal">New Post</button>
                        <button className='btn btn-outline-danger' onClick={this.handleSignoutClick}>Logout</button>
                    </div>
                </div>
                </nav>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3" />
                        <div className="col-lg-6">
                        {this.state.posts.map(post => (
                            <div className="card mt-3" key={post.id}>
                            <div className="card-header">
                            <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    {post.username}
                                    <div className='d-flex'>
                                        {moment(post.createdAt).format('MMMM Do YYYY, h:mm a')}
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    { this.state.userAttributes.preferred_username === post.username && <>
                                    <button className="btn btn-danger btn-sm float-end" onClick={() => this.handleDeletePost(post.id)}>delete</button>
                                    <button className="btn btn-info btn-sm float-end" data-bs-toggle="modal" data-bs-target="#updatePostModal" onClick={() => this.setPostToUpdate(post.id, post.content)}>edit</button>
                                    </>
                                    }
                                </div>
                            </div>
                            </div>
                            
                            
                            </div>
                            <div className="card-body">
                                {post.content}
                            </div>
                        </div>
                        ))} 
                        </div>
                        <div className="col-lg-3" />
                    </div>
                </div>

                {/* Create New Post Modal */}
                <div className="modal fade" id="newPostModal" tabIndex="-1" aria-labelledby="newPostModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="newPostModalHeader">New Post</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    <form id="newPostForm" onSubmit={this.handleCreateNewPost}>
                        <div className="mb-3">
                            <label htmlFor="postText" className="form-label">Say Something...</label>
                            <input type="text" value={this.state.newPostContent} onChange={this.handleChange} className="form-control" id="newPostText"/>
                        </div>
                    </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" form="newPostForm" className="btn btn-primary">Post</button>
                    </div>
                    </div>
                
                </div>
                </div>
                {/* Update Post Modal */}
                <div className="modal fade" id="updatePostModal" tabIndex="-1" aria-labelledby="updatePostModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                <form onSubmit={this.handleUpdatePost}>
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="updatePostModalHeader">Update Post</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="postText" className="form-label">New post content...</label>
                            <input type="text" value={this.state.updatedPostContent} onChange={this.handleEditChange} className="form-control" id="updatedPostText"/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary">Edit</button>
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