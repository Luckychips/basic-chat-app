import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import {Button, TextField, withStyles} from "@material-ui/core";

const styles = theme => ({
    container: {
        'display': 'flex',
        'flexWrap': 'wrap',
        'max-width': 450,
        'margin': '0 auto'
    },
    button: {
        'width': '100%',
        'margin-top': 20
    }
});

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { passwordOne } = this.state;

        this.props.firebase
            .doPasswordUpdate(passwordOne)
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
        const { classes } = this.props;
        const { passwordOne, passwordTwo, error } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo || passwordOne === '';

        return (
            <form onSubmit={this.onSubmit} className={classes.container}>
                <TextField
                    id="password-change-password-one-field"
                    label="New Password"
                    name="passwordOne"
                    type="password"
                    value={passwordOne}
                    placeholder="New Password"
                    helperText=""
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true
                    }}
                    onChange={this.onChange}
                />
                <TextField
                    id="password-change-password-two-field"
                    label="Confirm New Password"
                    name="passwordTwo"
                    type="password"
                    value={passwordTwo}
                    placeholder="Confirm New Password"
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

export default withFirebase(withStyles(styles)(PasswordChangeForm));