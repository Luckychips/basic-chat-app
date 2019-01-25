import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Button, TextField, withStyles} from "@material-ui/core";

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const styles = theme => ({
    PasswordForgetLink: {
        'max-width': 450,
        'margin': '0 auto',
        'padding': '10px 0 5px 0'
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

class PasswordForgetPage extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div>
                <h1 className={classes.title}>Forgot Password</h1>
                <PasswordForgetForm />
            </div>
        );
    }
}

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
        const { classes } = this.props;

        const isInvalid = email === '';

        return (
            <form onSubmit={this.onSubmit} className={classes.container}>
                <TextField
                    id="password-forget-email-field"
                    label="Email"
                    name="email"
                    type="text"
                    value={this.state.email}
                    placeholder="Email Address"
                    helperText=""
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={this.onChange}
                />

                <Button variant="outlined" color="primary" className={classes.button} disabled={isInvalid} type="submit">
                    Reset My Password
                </Button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const PasswordForgetForm = withFirebase(withStyles(styles)(PasswordForgetFormBase));
const PasswordForgetLink = withStyles(styles)(PasswordForgetLinkBase);

export { PasswordForgetForm, PasswordForgetLink };
export default withStyles(styles)(PasswordForgetPage);