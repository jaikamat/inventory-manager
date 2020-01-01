import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';

const Logout = props => {
    if (!props.loggedIn) {
        return <Redirect to="/login" />;
    }

    return (
        <React.Fragment>
            <Header as="h4">Click to logout</Header>
            <Button onClick={() => props.handleLogin('', '')}>Logout</Button>
        </React.Fragment>
    );
};

export default Logout;
