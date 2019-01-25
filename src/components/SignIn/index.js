import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withStyles, Button, TextField } from '@material-ui/core';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as PropTypes from "prop-types";

const styles = theme => ({
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

class SignInPage extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div>
                <h1 className={classes.title}>Sign In to</h1>
                <SignInForm />
                <PasswordForgetLink />
                <SignUpLink />
            </div>
        );
    }
}

SignInPage.propTypes = {
    classes: PropTypes.object.isRequired
};


const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
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
        const { classes } = this.props;
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <form onSubmit={this.onSubmit} className={classes.container}>
                <TextField
                    id="sign-in-email-field"
                    label="Email"
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
                    id="sign-in-password-field"
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    placeholder="Password"
                    helperText=""
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={this.onChange}
                />

                <Button variant="outlined" color="primary" className={classes.button} disabled={isInvalid} type="submit">Sign In</Button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

SignInFormBase.propTypes = {
    classes: PropTypes.object.isRequired
};

const SignInForm = compose(withRouter, withFirebase)(withStyles(styles)(SignInFormBase));

export { SignInForm };
export default withStyles(styles)(SignInPage);