import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Sale from './Sale';
import BrowseSales from './BrowseSales';
import PublicInventory from './PublicInventory';
import DeckboxClone from './DeckboxClone';
import Login from './Login';
import Logout from './Logout';
import Receiving from './Receiving/Receiving';
import styled from 'styled-components';
import { Segment, Icon, Header } from 'semantic-ui-react';

const ContentContainer = styled.div`
    padding-top: 52.63px;
    margin-left: 20px;
    margin-right: 20px;
`;

const CovidAlert = () => {
    return <Segment placeholder>
        <Header icon>
            <Icon name="exclamation circle" color="blue" />
            A notice to our customers regarding COVID19
        </Header>
        <span>
            In compliance with the Governor's order, the Clubhouse will be closed as of 3/24. Watch our Facebook and Discord for re-opening celebration announcements once the closure is lifted!
        </span>
        <br />
        <span>The Clubhouse and its staff wishes all of our friends well!</span>
    </Segment>
}

export default function Main() {
    return (
        <ContentContainer>
            <br />

            <Switch>
                <Route exact path="/" component={CovidAlert} />
                <Route exact path="/manage-inventory" component={Home} />
                <Route exact path="/new-sale" component={Sale} />
                <Route exact path="/browse-sales" component={BrowseSales} />
                <Route exact path="/browse-inventory" component={DeckboxClone} />
                <Route exact path="/public-inventory" component={PublicInventory} />
                <Route exact path="/receiving" component={Receiving} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
            </Switch>
        </ContentContainer>
    )
}