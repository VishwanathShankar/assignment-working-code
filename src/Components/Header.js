import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../Styles/header.css';
import { withRouter } from 'react-router-dom';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: 'solid 2px brown'
    }
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            signUpModalIsOpen: false,
            loginModalIsOpen: false,
            email: '',
            pwd: '',
            FN: '',
            LN: '',
            isLoggedIn: false
        }
    }

    signUp = () => {
        this.setState({ signUpModalIsOpen: true });
    }

    login = () => {
        this.setState({ loginModalIsOpen: true });
    }

    handleCancelSignUp = () => {
        this.setState({ signUpModalIsOpen: false });
    }

    handleCancelLogin = () => {
        this.setState({ loginModalIsOpen: false });
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    handleSignUp = () => {
        const { email, pwd, FN, LN } = this.state;
        const signUpObj = {
            email: email,
            password: pwd,
            firstname: FN,
            lastname: LN
        };
        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/signup',
            headers: { 'Content-Type': 'application/json' },
            data: signUpObj
        })
            .then(response => {
                if (response.data.message == 'User SignedUp Sucessfully') {
                    this.setState({
                        signUpModalIsOpen: false,
                        email: '',
                        pwd: '',
                        FN: '',
                        LN: ''
                    });
                    alert(response.data.message);
                }
            })
            .catch(err => console.log(err))
    }

    handleLogin = () => {
        const { email, pwd } = this.state;
        const loginObj = {
            email: email,
            password: pwd
        };
        axios({
            method: 'GET',
            url: 'http://localhost:6503/api/login',
            headers: { 'Content-Type': 'application/json' },
            data: loginObj
        })
            .then(response => {
                this.setState({
                    isLoggedIn: response.data.isAuthenticated,
                    loginModalIsOpen: false,
                    email: '',
                    pwd: '',
                });
                sessionStorage.setItem('isLoggedIn', response.data.isAuthenticated);
            })
            .catch(err => console.log(err))
    }

    handleLogo = () => {
        this.props.history.push('/');
    }

    responseGoogle = (response) => {
        console.log(response.profileObj.name);
    }

    responseFacebook = (response) => {
        console.log(response.name);
    }

    render() {
        const { signUpModalIsOpen, loginModalIsOpen, email, pwd, FN, LN } = this.state;
        return (
            <div className="header">
                <div className="s-logo" onClick={this.handleLogo}>
                    <p>e!</p>
                </div>
                <div className="btn-group login-block">
                    <span onClick={this.login} className="login">LogIn</span>
                    <span onClick={this.signUp} className="signUp">Create an account</span>
                </div>
                <Modal

                    style={customStyles}
                >
                    <div>
                        <h3>SignUp User</h3>
                        <div><span>Email : </span><input type="text" value={email} onChange={(event) => this.handleChange(event, 'email')} /></div>
                        <div><span>Password : </span><input type="password" value={pwd} onChange={(event) => this.handleChange(event, 'pwd')} /></div>
                        <div><span>First Name: </span><input type="text" value={FN} onChange={(event) => this.handleChange(event, 'FN')} /></div>
                        <div><span>Last Name: </span><input type="text" value={LN} onChange={(event) => this.handleChange(event, 'LN')} /></div>
                        <button onClick={this.handleSignUp} class="btn btn-sm btn-primary">SignUp</button>
                        <button class="btn btn-sm btn-primary" onClick={this.handleCancelSignUp}>Cancel</button>
                    </div>
                </Modal>
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div class="login-heading">Login</div>
                        <div style={{ marginBottom: '2px' }}>
                            <GoogleLogin
                                clientId="745717577080-5uo0jrq7g23qqioe155h28u94a0co1cj.apps.googleusercontent.com"
                                buttonText="Continue with Gmail"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                className="btn google"
                                cookiePolicy={'single_host_origin'}
                            /></div>
                        <FacebookLogin
                            appId="1938560389620287"
                            textButton="Continue with Facebook"
                            size="metro"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn-md fb"
                            icon="fa-facebook-square"
                        /><br />
                        <button className="btn normal-login">
                            <span className="glyphicon glyphicon-user user-icon"></span>
                            Login with Credentials</button>
                        <hr />
                        <div>Don't have account? <span style={{ color: 'red' }}>SignUp</span></div>
                    </div>
                </Modal>
                <Modal
                    isOpen={signUpModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div class="login-heading">Sign Up</div>
                        <div style={{ marginBottom: '2px' }}>
                            <GoogleLogin
                                clientId="745717577080-5uo0jrq7g23qqioe155h28u94a0co1cj.apps.googleusercontent.com"
                                buttonText="Continue with Gmail"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                className="google"
                                cookiePolicy={'single_host_origin'}
                            /></div>
                        <FacebookLogin
                            appId="1938560389620287"
                            textButton="Continue with Facebook"
                            size="metro"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn-md fb"
                            icon="fa-facebook-square"
                        />
                        <hr />
                        <div>Already have an account? <span style={{ color: 'red' }}>Login</span></div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Header);