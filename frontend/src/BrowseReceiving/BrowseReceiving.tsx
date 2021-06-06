import React, { FC, useEffect, useState } from 'react';
import SearchBar from '../common/SearchBar';
import {
    Header,
    Button,
    Loader,
    Accordion,
    List,
    Segment,
    Label,
} from 'semantic-ui-react';
import browseReceivingQuery, { Received } from './browseReceivingQuery';
import pluralize from '../utils/pluralize';
import formatDate from '../utils/formatDate';
import { Trade } from '../context/ReceivingContext';
import displayFinishCondition from '../utils/finishCondition';
import { price } from '../utils/price';

function alphaSort<T extends { name: string }>(arr: T[]) {
    return [...arr].sort((a, b) => a.name.localeCompare(b.name));
}

function displayTrade(trade: Trade) {
    if (trade === Trade.Credit) return 'Credit';
    else if (trade === Trade.Cash) return 'Cash';
}

const BrowseReceiving: FC = () => {
    const [receivedList, setReceivedList] = useState<Received[]>([]);
    const [cardName, setCardName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const received = await browseReceivingQuery({
                cardName,
                startDate: null,
                endDate: null,
            });
            setLoading(false);
            setReceivedList(received);
        })();
    }, [cardName]);

    const handleSearchSelect = (cardName: string) => setCardName(cardName);

    // This used to reset the key of the searchbar to force a rerender via key change and state reset
    // Hacky but gets the job done until we can refactor the search bar component
    const handleClear = () => {
        setCount(count + 1);
        setCardName(null);
    };

    return (
        <div>
            <SearchBar handleSearchSelect={handleSearchSelect} key={count} />
            {cardName && <Button onClick={handleClear}>Clear</Button>}

            <Header as="h2">Browse Receiving</Header>
            {loading ? (
                <Loader active inline="centered" />
            ) : (
                <Accordion>
                    {receivedList.map((rl, idx) => {
                        return (
                            <ReceivingItem
                                key={rl._id}
                                received={rl}
                                index={idx}
                                activeIndex={activeIndex}
                                onClick={(v) => {
                                    if (v === activeIndex) {
                                        setActiveIndex(null);
                                    } else {
                                        setActiveIndex(v);
                                    }
                                }}
                            />
                        );
                    })}
                </Accordion>
            )}
        </div>
    );
};

interface ReceivingItemProps {
    received: Received;
    index: number;
    activeIndex: number | null;
    onClick: (v: number) => void;
}

const ReceivingItem: FC<ReceivingItemProps> = ({
    received,
    index,
    activeIndex,
    onClick,
}) => {
    const active = activeIndex === index;

    return (
        <Segment>
            <Accordion.Title
                active={active}
                index={index}
                onClick={(_, titleProps) => {
                    if (typeof titleProps.index === 'number') {
                        onClick(titleProps.index);
                    }
                }}
            >
                <List.Item>
                    <List.Icon
                        name="dropdown"
                        size="large"
                        verticalAlign="middle"
                    />

                    <Label>
                        {`${received.received_card_list.length} ${pluralize(
                            received.received_card_list.length,
                            'card'
                        )}`}
                    </Label>
                    <span> {formatDate(received.created_at)}</span>
                </List.Item>
            </Accordion.Title>
            <Accordion.Content active={active}>
                <List divided relaxed>
                    {alphaSort(received.received_card_list).map((c) => {
                        return (
                            <List.Item>
                                <List.Content>
                                    <List.Header>
                                        <span>{c.name}</span>
                                        <i
                                            className={`ss ss-fw ss-${c.set}`}
                                            style={{ fontSize: '20px' }}
                                        />
                                        <span>({c.set_name})</span>
                                    </List.Header>
                                    <List.Description>
                                        <span>
                                            {`${displayFinishCondition(
                                                c.finishCondition
                                            )} | ${displayTrade(c.tradeType)}`}
                                        </span>
                                        {c.tradeType === Trade.Credit && (
                                            <span>
                                                {` | Credit price: ${price(
                                                    c.creditPrice
                                                )}`}
                                            </span>
                                        )}
                                        {c.tradeType === Trade.Cash && (
                                            <span>
                                                {` | Cash price: ${price(
                                                    c.cashPrice
                                                )} | Market price: ${price(
                                                    c.marketPrice
                                                )}`}
                                            </span>
                                        )}
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        );
                    })}
                </List>
            </Accordion.Content>
        </Segment>
    );
};

export default BrowseReceiving;
