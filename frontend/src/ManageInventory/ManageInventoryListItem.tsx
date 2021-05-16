import React, { FC, useContext, useState } from 'react';
import { Segment, Input, Button, Form, Select, Item } from 'semantic-ui-react';
import axios from 'axios';
import $ from 'jquery';
import { Formik, FormikErrors, FormikHelpers } from 'formik';
import createToast from '../common/createToast';
import CardImage from '../common/CardImage';
import makeAuthHeader from '../utils/makeAuthHeader';
import { ADD_CARD_TO_INVENTORY } from '../utils/api_resources';
import { finishes, cardConditions } from '../utils/dropdownOptions';
import checkCardFinish from '../utils/checkCardFinish';
import { InventoryContext } from '../context/InventoryContext';
import { InventoryCard } from '../utils/ScryfallCard';
import CardHeader from '../ui/CardHeader';

interface Props {
    card: InventoryCard;
}

interface FormValues {
    selectedFinish: Finish;
    selectedCondition: string;
    quantity: string;
}

type Finish = 'FOIL' | 'NONFOIL';

const ManageInventoryListItem: FC<Props> = ({ card }) => {
    const {
        foil,
        nonfoil,
        name,
        set_name,
        set,
        id,
        cardImage,
        card_faces,
        image_uris,
    } = card;

    const [selectedFinish, setSelectedFinish] = useState<Finish>(
        checkCardFinish(nonfoil, foil).selectedFinish
    );

    const { changeCardQuantity } = useContext(InventoryContext);

    const initialFormValues: FormValues = {
        selectedFinish: checkCardFinish(nonfoil, foil).selectedFinish,
        selectedCondition: 'NM',
        quantity: '0',
    };

    const validate = ({ quantity }: FormValues) => {
        let errors: FormikErrors<FormValues> = {};

        if (
            !Number(quantity) ||
            !Number.isInteger(+quantity) ||
            +quantity > 100
        )
            errors.quantity = 'error';

        return errors;
    };

    const onSubmit = async (
        { quantity, selectedFinish, selectedCondition }: FormValues,
        { resetForm }: FormikHelpers<FormValues>
    ) => {
        try {
            const { data } = await axios.post(
                ADD_CARD_TO_INVENTORY,
                {
                    quantity: parseInt(quantity, 10),
                    finishCondition: `${selectedFinish}_${selectedCondition}`,
                    cardInfo: { id, name, set_name, set },
                },
                { headers: makeAuthHeader() }
            );

            // Imperatively reset the form using Formik actions
            resetForm();

            changeCardQuantity(id, data.qoh);

            createToast({
                color: 'green',
                header: `${quantity}x ${name} ${
                    parseInt(quantity, 10) > 0 ? 'added' : 'removed'
                }!`,
                duration: 2000,
            });

            // Highlight the input after successful card add
            $('#searchBar').focus().select();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Segment>
            <Item.Group divided>
                <Item>
                    <Item.Image size="tiny">
                        <CardImage
                            image={cardImage}
                            image_uris={image_uris}
                            card_faces={card_faces}
                            hover={true}
                        />
                    </Item.Image>
                    <Item.Content>
                        <CardHeader
                            card={card}
                            selectedFinish={selectedFinish}
                        />
                        <Item.Description>
                            <Formik
                                initialValues={initialFormValues}
                                validate={validate}
                                onSubmit={onSubmit}
                                initialErrors={{ quantity: 'error' }}
                            >
                                {({
                                    values,
                                    handleSubmit,
                                    setFieldValue,
                                    isSubmitting,
                                    isValid,
                                }) => (
                                    <Form>
                                        <Form.Group>
                                            <Form.Field
                                                control={Input}
                                                type="number"
                                                label="Quantity"
                                                value={values.quantity}
                                                onChange={(
                                                    _: any,
                                                    { value }: { value: number }
                                                ) =>
                                                    setFieldValue(
                                                        'quantity',
                                                        value
                                                    )
                                                }
                                                onFocus={() => {
                                                    if (
                                                        +values.quantity === 0
                                                    ) {
                                                        setFieldValue(
                                                            'quantity',
                                                            ''
                                                        );
                                                    }
                                                }}
                                            />
                                            <Form.Field
                                                label="Finish"
                                                control={Select}
                                                value={values.selectedFinish}
                                                options={finishes}
                                                disabled={
                                                    checkCardFinish(
                                                        nonfoil,
                                                        foil
                                                    ).finishDisabled
                                                }
                                                onChange={(
                                                    _: any,
                                                    { value }: { value: Finish }
                                                ) => {
                                                    setSelectedFinish(value);
                                                    setFieldValue(
                                                        'selectedFinish',
                                                        value
                                                    );
                                                }}
                                            />
                                            <Form.Field
                                                label="Condition"
                                                control={Select}
                                                value={values.selectedCondition}
                                                options={cardConditions}
                                                onChange={(
                                                    _: any,
                                                    { value }: { value: string }
                                                ) =>
                                                    setFieldValue(
                                                        'selectedCondition',
                                                        value
                                                    )
                                                }
                                            />
                                            <Form.Button
                                                label="Add to Inventory?"
                                                control={Button}
                                                primary
                                                disabled={
                                                    !isValid || isSubmitting
                                                }
                                                onClick={() => handleSubmit()}
                                                loading={isSubmitting}
                                            >
                                                Submit
                                            </Form.Button>
                                        </Form.Group>
                                    </Form>
                                )}
                            </Formik>
                        </Item.Description>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    );
};

export default ManageInventoryListItem;