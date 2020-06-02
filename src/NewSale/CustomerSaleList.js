import React from 'react';
import SaleLineItem from './SaleLineItem';
import { Table, Segment, Header, Icon } from 'semantic-ui-react';
import SalePriceTotal from './SalePriceTotal';
import FinishSale from './FinishSale';

export default function CustomerSaleList({ saleList }) {
    if (saleList.length === 0) {
        return <Segment placeholder>
            <Header icon>
                <Icon name="plus" />
                    View and manage customer sale list here
            </Header>
        </Segment>
    }

    return <React.Fragment>
        <Table>
            <Table.Body>
                {saleList.map(card => {
                    return <SaleLineItem
                        displayName={card.display_name}
                        {...card}
                        key={`${card.id}${card.finishCondition}${card.qtyToSell}`}
                    />
                })}
            </Table.Body>
        </Table>

        <Segment clearing>
            <Header floated="left">
                <Header sub>Subtotal</Header>
                <SalePriceTotal saleList={saleList} />
            </Header>
            <FinishSale />
        </Segment>
    </React.Fragment>
};