import React, { useContext, FC, useState, useEffect } from 'react';
import BrowseCardList from './SaleSearchCardList';
import SaleCartList from './SaleCartList';
import PrintList from './PrintList';
import SuspendSaleButton from './SuspendSaleButton';
import { SaleContext } from '../context/SaleContext';
import TotalCardsLabel from '../common/TotalCardsLabel';
import TotalStoreInventory from '../ManageInventory/TotalStoreInventory';
import sum from '../utils/sum';
import { Box, Grid } from '@material-ui/core';
import { HeaderText } from '../ui/Typography';
import useInterruptExit from '../utils/useInterruptExit';
import { Prompt } from 'react-router';
import ControlledSearchBar from '../ui/ControlledSearchBar';

interface Props {}

const Sale: FC<Props> = () => {
    const { setShowPrompt } = useInterruptExit(false);
    const [term, setTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {
        saleListCards,
        searchTerm,
        searchResults,
        handleResultSelect,
        suspendedSale,
        restoreSale,
        deleteSuspendedSale,
        suspendSale,
    } = useContext(SaleContext);

    /**
     * Maintains whether or not we show the exit prompt on tab close or refresh
     */
    useEffect(() => {
        if (saleListCards.length > 0) {
            setShowPrompt(true);
        } else {
            setShowPrompt(false);
        }
    }, [saleListCards]);

    useEffect(() => {
        if (term) {
            (async () => {
                setLoading(true);
                await handleResultSelect(term);
                setLoading(false);
            })();
        }
    }, [term]);

    return (
        <>
            <Prompt
                message="You have items in your list. Are you sure you wish to leave?"
                when={saleListCards.length > 0}
            />
            <Grid container>
                <Grid item xs={12} md={4}>
                    <ControlledSearchBar
                        value={term}
                        onChange={(v) => setTerm(v)}
                    />
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
                    <Grid container justify="space-between">
                        <HeaderText>Inventory</HeaderText>
                        {term && (
                            <TotalStoreInventory
                                searchResults={searchResults}
                                title={term}
                            />
                        )}
                    </Grid>
                    <br />
                    <BrowseCardList
                        loading={loading}
                        term={searchTerm}
                        cards={searchResults}
                    />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Grid container justify="space-between">
                        <Box display="flex" alignItems="center">
                            <HeaderText>
                                {suspendedSale.name === ''
                                    ? 'Sale Items'
                                    : `${suspendedSale.name}'s Items`}
                            </HeaderText>
                            <TotalCardsLabel
                                listLength={sum(
                                    saleListCards.map((c) => c.qtyToSell)
                                )}
                            />
                        </Box>
                        <Box display="flex">
                            <SuspendSaleButton
                                restoreSale={restoreSale}
                                suspendSale={suspendSale}
                                saleListLength={saleListCards.length}
                                deleteSuspendedSale={deleteSuspendedSale}
                                id={suspendedSale._id}
                            />
                            {saleListCards.length > 0 && (
                                <PrintList saleListCards={saleListCards} />
                            )}
                        </Box>
                    </Grid>
                    <br />
                    <SaleCartList saleList={saleListCards} />
                </Grid>
            </Grid>
        </>
    );
};

export default Sale;
