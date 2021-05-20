import React, { FC, SyntheticEvent, useState } from 'react';
import axios from 'axios';
import { Grid, Segment, Header, Icon, Form, Select } from 'semantic-ui-react';
import SearchBar from '../common/SearchBar';
import { GET_CARDS_WITH_INFO_PUBLIC } from '../utils/api_resources';
import { InventoryCard, ScryfallApiCard } from '../utils/ScryfallCard';
import { Formik } from 'formik';
import { ClubhouseLocation } from '../context/AuthProvider';
import styled from 'styled-components';
import PublicCardItem from './PublicCardItem';

interface State {
    searchResults: InventoryCard[];
    searchTerm: string;
    selectedLocation: ClubhouseLocation;
}

interface FormValues {
    searchTerm: string;
    selectedLocation: ClubhouseLocation;
}

const GridContainer = styled('div')({
    display: 'grid',
    gridGap: '20px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    justifyItems: 'center',
});

const StyledFormGroup = styled(Form.Group)({
    alignItems: 'flex-end',
});

const initialState: State = {
    searchResults: [],
    searchTerm: '',
    selectedLocation: 'ch1',
};

const initialFormState: FormValues = {
    searchTerm: '',
    selectedLocation: 'ch1',
};

const locationOptions = [
    { key: 'beaverton', text: 'CH Beaverton', value: 'ch1' },
    { key: 'hillsboro', text: 'CH Hillsboro', value: 'ch2' },
];

const PublicInventory: FC = () => {
    const [state, setState] = useState<State>(initialState);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    const fetchCards = async ({
        title,
        location,
    }: {
        title: string;
        location: ClubhouseLocation;
    }) => {
        try {
            const { data }: { data: ScryfallApiCard[] } = await axios.get(
                GET_CARDS_WITH_INFO_PUBLIC,
                {
                    params: {
                        title,
                        location,
                        matchInStock: true,
                    },
                }
            );

            setState({
                ...state,
                searchResults: data.map((c) => new InventoryCard(c)),
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Formik
                onSubmit={async ({
                    searchTerm,
                    selectedLocation,
                }: FormValues) => {
                    await fetchCards({
                        title: searchTerm,
                        location: selectedLocation,
                    });

                    setFormSubmitted(true);
                }}
                initialValues={initialFormState}
            >
                {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
                    <Form>
                        <StyledFormGroup widths="5">
                            <Form.Field>
                                <label>Card search</label>
                                <SearchBar
                                    handleSearchSelect={(value) =>
                                        setFieldValue('searchTerm', value)
                                    }
                                />
                            </Form.Field>
                            <Form.Field
                                label="Store location"
                                control={Select}
                                value={values.selectedLocation}
                                options={locationOptions}
                                onChange={(
                                    _: SyntheticEvent,
                                    { value }: { value: ClubhouseLocation }
                                ) => setFieldValue('selectedLocation', value)}
                            />
                            <Form.Button
                                type="submit"
                                primary
                                disabled={!values.searchTerm}
                                loading={isSubmitting}
                                onClick={() => handleSubmit()}
                            >
                                Search
                            </Form.Button>
                        </StyledFormGroup>
                    </Form>
                )}
            </Formik>
            <br />
            <Grid stackable={true}>
                <Grid.Column>
                    <Header as="h2">
                        Inventory Search
                        <Header.Subheader>
                            <em>
                                Card prices subject to change. Consult a
                                Clubhouse employee for final estimates
                            </em>
                        </Header.Subheader>
                    </Header>
                    {state.searchResults.length > 0 ? (
                        <GridContainer>
                            {state.searchResults.map((c) => (
                                <PublicCardItem key={c.id} card={c} />
                            ))}
                        </GridContainer>
                    ) : (
                        <Segment placeholder>
                            <Header icon>
                                <Icon name="search" />
                                {formSubmitted ? (
                                    <span>No cards found in stock</span>
                                ) : (
                                    <span>Search for a card</span>
                                )}
                            </Header>
                        </Segment>
                    )}
                </Grid.Column>
            </Grid>
        </>
    );
};

export default PublicInventory;
