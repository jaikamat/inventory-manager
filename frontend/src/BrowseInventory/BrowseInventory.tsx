import React, { FC, useState } from 'react';
import BrowseInventoryForm, { initialFilters } from './BrowseInventoryForm';
import BrowseInventoryRow from './BrowseInventoryRow';
import _ from 'lodash';
import filteredCardsQuery, {
    Filters,
    ResponseCard,
} from './filteredCardsQuery';
import Placeholder from '../ui/Placeholder';
import SearchIcon from '@material-ui/icons/Search';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Container,
    Modal,
    CircularProgress,
    withStyles,
} from '@material-ui/core';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Pagination from '@material-ui/lab/Pagination';

const LIMIT = 100; // Matching the backend for now

export const InvertedLoader = withStyles(({ palette }) => ({
    root: {
        color: palette.common.white,
    },
}))(CircularProgress);

interface State {
    cards: ResponseCard[];
    count: number;
    currentPage: number;
    numPages: number;
    isLoading: boolean;
    cachedFilters: Filters;
    searchTouched: boolean;
}

const BrowseInventory: FC = () => {
    const [state, setState] = useState<State>({
        cards: [],
        count: 0,
        currentPage: 0,
        numPages: 0,
        isLoading: false,
        cachedFilters: initialFilters,
        searchTouched: false, // Tracks whether the user has initially searched for the 'no results' message
    });

    const fetchData = async (filters: Filters, page: number) => {
        try {
            setState({ ...state, isLoading: true });

            const { cards, total } = await filteredCardsQuery(filters, page);

            const numPages = Math.ceil(total / LIMIT);

            setState({
                ...state,
                cards: cards,
                count: total,
                isLoading: false,
                numPages: numPages,
                currentPage: page,
                searchTouched: true,
                // Set the filters for pagination requests later
                cachedFilters: filters,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const {
        cards,
        isLoading,
        currentPage,
        numPages,
        count,
        cachedFilters,
    } = state;

    return (
        <Container>
            <Modal open={isLoading}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={1}
                >
                    <InvertedLoader />
                </Box>
            </Modal>
            <Box pb={2}>
                <Typography>
                    <ReportProblemIcon
                        fontSize="small"
                        color="primary"
                        style={{ verticalAlign: 'middle' }}
                    />
                    Prices from this table are updated weekly and are subject to
                    fluctuations. Consult 'New Sale' or 'Manage Inventory' for
                    up-to-date values
                </Typography>
            </Box>
            <BrowseInventoryForm doSubmit={fetchData} />
            <br />
            {!!cards.length && (
                <TableContainer component={Paper} variant="outlined">
                    <Box p={2} display="flex" justifyContent="space-between">
                        <Pagination
                            count={numPages}
                            page={currentPage}
                            onChange={(_, page) =>
                                fetchData(cachedFilters, page)
                            }
                            color="primary"
                        />
                        <Typography>Total results: {count}</Typography>
                    </Box>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Edition</TableCell>
                                <TableCell>Condition</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price Estimate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cards.map((card) => (
                                <BrowseInventoryRow
                                    key={`${card._id}-${card.finishCondition}`}
                                    card={card}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {!cards.length && (
                <Placeholder icon={<SearchIcon style={{ fontSize: 80 }} />}>
                    {state.searchTouched
                        ? 'No results found'
                        : 'Use the filters to browse inventory'}
                </Placeholder>
            )}
        </Container>
    );
};

export default BrowseInventory;
