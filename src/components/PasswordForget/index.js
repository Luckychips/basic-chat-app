import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from "@material-ui/core";

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const styles = theme => ({
    PasswordForgetLink: {
        'max-width': 450,
        'margin': '0 auto',
        'padding': '10px 0 5px 0'
    }
});

const PasswordForgetPage = () => (
    <div>
        <h1>PasswordForget</h1>
        <PasswordForgetForm />
    </div>
);

class PasswordForgetLinkBase extends Component {
    render() {
        const { classes } = this.props;

        return (
            <p className={classes.PasswordForgetLink}>
                <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
            </p>
        );
    }
}

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
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
        const { email, error } = this.state;

        const isInvalid = email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <button disabled={isInvalid} type="submit">
                    Reset My Password
                </button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
const PasswordForgetLink = withStyles(styles)(PasswordForgetLinkBase);

export { PasswordForgetForm, PasswordForgetLink };
export default PasswordForgetPage;