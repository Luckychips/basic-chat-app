import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase/context';
import * as ROUTES from '../../constants/routes';
import {Button, TextField, withStyles} from "@material-ui/core";

const styles = theme => ({
    SignUpLink: {
        'max-width': 450,
        'margin': '0 auto',
        'padding': '5px 0'
    },
    container: {
        'display': 'flex',
        'flexWrap': 'wrap',
        'max-width': 450,
        'margin': '0 auto'
    },
    title: {
        'text-align': 'center',
        'font-weight': 100
    },
    button: {
        'width': '100%',
        'margin-top': 20
    }
});

class SignUpPage extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div>
                <h1 className={classes.title}>Sign Up</h1>
                <SignUpForm />
            </div>
        );
    }
}

class SignUpLinkBase extends Component {
    render() {
        const { classes } = this.props;

        return (
            <p className={classes.SignUpLink}>
                Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
            </p>
        );
    }
}

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { username, email, passwordOne } = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // Create a user in your Firebase realtime database
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                    });
            })
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const { classes } = this.props;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit} className={classes.container}>
                <TextField
                    id="sign-up-username-field"
                    label="Full Name"
                    name="username"
                    type="text"
                    value={username}
                    placeholder="Full Name"
                    helperText=""
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={this.onChange}
                />
                <TextField
                    id="sign-up-email-field"
                    label="Email Address"
                    name="email"
                    type="text"
                    value={email}
                    placeholder="Email Address"
                    helperText=""
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={this.onChange}
                />
                <TextField
                    id="sign-up-password-one-field"
                    label="Password"
                    name="passwordOne"
                    type="password"
                    value={passwordOne}
                    placeholder="Password"
                    helperText=""
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={this.onChange}
                />
                <TextField
                    id="sign-up-password-two-field"
                    label="Confirm Password"
                    name="passwordTwo"
                    type="password"
                    value={passwordTwo}
                    placeholder="Confirm Password"
                    helperText=""
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={this.onChange}
                />

                <Button variant="outlined" color="primary" className={classes.button} disabled={isInvalid} type="submit">
                    Sign Up
                </Button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpForm = compose(withRouter, withFirebase)(withStyles(styles)(SignUpFormBase));
const SignUpLink = withStyles(styles)(SignUpLinkBase);

export { SignUpForm, SignUpLink };
export default withStyles(styles)(SignUpPage);