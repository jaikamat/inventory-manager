import express from 'express';
const router = express.Router();
require('dotenv').config();
import jwt from 'jsonwebtoken';
import getCardsByFilter from '../interactors/getCardsByFilter';
import addCardToInventory from '../interactors/addCardToInventory';
import getDistinctSetNames from '../interactors/getDistinctSetNames';
import getCardsWithInfo from '../interactors/getCardsWithInfo';
import finishSale from '../interactors/updateInventoryCards';
import getSalesFromCardname from '../interactors/getSalesFromCardname';
import getAllSales from '../interactors/getAllSales';
import getFormatLegalities from '../interactors/getFormatLegalities';
import addCardToInventoryReceiving from '../interactors/addCardToInventoryReceiving';
import getSuspendedSales from '../interactors/getSuspendedSales';
import getSuspendedSale from '../interactors/getSuspendedSale';
import createSuspendedSale from '../interactors/createSuspendedSale';
import deleteSuspendedSale from '../interactors/deleteSuspendedSale';
import addCardsToReceivingRecords from '../interactors/addCardsToReceivingRecords';
import getCardsFromReceiving from '../interactors/getCardsFromReceiving';
import getUserById, { User } from '../interactors/getUserById';
import Joi from 'joi';
import {
    validColorSpecificity,
    validContact,
    validDate,
    validFinish,
    validFinishConditions,
    validFormatLegalities,
    validFrame,
    validInteger,
    validName,
    validPrice,
    validPriceOperator,
    validSort,
    validSortDirection,
    validString,
    validStringRequired,
    validTradeType,
    validTypeline,
} from '../common/validations';
import {
    AddCardToInventoryReq,
    AddCardToInventoryReqBody,
    ColorSpecificity,
    DecodedToken,
    Finish,
    FinishSaleCard,
    FormatLegality,
    Frame,
    JoiValidation,
    PriceFilter,
    ReceivingBody,
    ReceivingCard,
    RequestWithUserInfo,
    ReqWithFinishSaleCards,
    ReqWithReceivingCards,
    ReqWithSuspendSale,
    SortBy,
    SortByDirection,
    SuspendSaleBody,
    TypeLine,
} from '../common/types';
import moment from 'moment';
import getReceivingById from '../interactors/getReceivingById';
import getSalesReport from '../interactors/getSalesReport';
import getCardPrintings from '../interactors/getCardPrintings';

/**
 * Middleware to check for Bearer token by validating JWT
 *
 * It attaches current user information to the req for downstream use
 */
router.use(async (req: RequestWithUserInfo, res, next) => {
    let token = req.headers['authorization']; // Express headers converted to lowercase

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        try {
            // Will throw error if validation fails
            const { userId, currentLocation } = jwt.verify(
                token,
                process.env.PRIVATE_KEY
            ) as DecodedToken;

            const user: User = await getUserById(userId);

            // Attach current location information to the req
            // TODO: This should eventually just be a "store id"
            req.currentLocation = currentLocation;

            // Attach user information
            req.userId = userId;
            req.locations = user.locations;
            req.lightspeedEmployeeNumber = user.lightspeedEmployeeNumber;

            // Flag admins
            req.isAdmin = user.locations.length === 2;

            console.log(
                `Operation started by ${user.username} at location ${currentLocation}`
            );

            return next();
        } catch (err) {
            console.log(err);
            res.status(401).send('Invalid token');
        }
    } else {
        res.status(401).send('No token present on request');
    }
});

/**
 * Request body schema sanitization middleware
 */
router.post('/addCardToInventory', (req: AddCardToInventoryReq, res, next) => {
    const schema = Joi.object<AddCardToInventoryReqBody>({
        quantity: validInteger,
        finishCondition: validFinishConditions,
        cardInfo: Joi.object({
            id: validStringRequired,
            name: validStringRequired,
            set_name: validStringRequired,
            set: validStringRequired,
        }).required(),
    });

    const { error }: JoiValidation<AddCardToInventoryReqBody> = schema.validate(
        req.body,
        {
            abortEarly: false,
            allowUnknown: true,
        }
    );

    if (error) {
        return res.status(400).json(error);
    }
    return next();
});

router.post('/addCardToInventory', async (req: AddCardToInventoryReq, res) => {
    try {
        const { quantity, finishCondition, cardInfo } = req.body;
        const { currentLocation: location } = req;
        const { id, name, set_name, set } = cardInfo;
        const message = await addCardToInventory({
            quantity,
            finishCondition,
            id,
            name,
            set_name,
            set,
            location,
        });
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/**
 * Sale middleware that sanitizes card array to ensure inputs are valid. Will throw errors and end sale if needed
 */
router.post('/finishSale', (req: ReqWithFinishSaleCards, res, next) => {
    const schema = Joi.object<FinishSaleCard>({
        id: validStringRequired,
        price: validPrice,
        qtyToSell: validInteger,
        name: validStringRequired,
        set_name: validStringRequired,
        finishCondition: validFinishConditions,
    });

    const { cards } = req.body;

    try {
        for (let card of cards) {
            const { error }: JoiValidation<FinishSaleCard> = schema.validate(
                card,
                {
                    abortEarly: false,
                    allowUnknown: true,
                }
            );

            if (error) {
                return res.status(400).json(error);
            }
        }

        return next();
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

/**
 * Create root POST route
 */
router.post('/finishSale', async (req: ReqWithFinishSaleCards, res) => {
    try {
        const { cards } = req.body;
        const { currentLocation, lightspeedEmployeeNumber } = req;

        const data = await finishSale(
            cards,
            currentLocation,
            lightspeedEmployeeNumber
        );

        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

router.get('/allSales', async (req: RequestWithUserInfo, res) => {
    try {
        const sales_data = await getAllSales(req.currentLocation);
        const format_legalities = await getFormatLegalities(
            req.currentLocation
        );
        res.status(200).send({ sales_data, format_legalities });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

interface GetSaleByTitleQuery {
    cardName: string;
}

router.get('/getSaleByTitle', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<GetSaleByTitleQuery>({
        cardName: validStringRequired,
    });

    const { error, value }: JoiValidation<GetSaleByTitleQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const message = await getSalesFromCardname(
            value.cardName,
            req.currentLocation
        );
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/**
 * Sanitizes card object properties so nothing funky is committed to the database
 */
router.post('/receiveCards', (req: ReqWithReceivingCards, res, next) => {
    const receivingCardSchema = Joi.object<ReceivingCard>({
        id: validStringRequired,
        quantity: validInteger,
        name: validStringRequired,
        set_name: validStringRequired,
        finishCondition: validFinishConditions,
        set: validStringRequired,
        creditPrice: validPrice,
        cashPrice: validPrice,
        marketPrice: validPrice,
        tradeType: validTradeType,
    });

    const schema = Joi.object<ReceivingBody>({
        customerName: validName,
        customerContact: validContact,
        cards: Joi.array().items(receivingCardSchema),
    });

    try {
        const { error }: JoiValidation<ReceivingCard> = schema.validate(
            req.body,
            { abortEarly: false }
        );

        if (error) {
            return res.status(400).json(error);
        }

        return next();
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/receiveCards', async (req: ReqWithReceivingCards, res) => {
    try {
        const { cards, customerName, customerContact } = req.body;
        const messages = await addCardToInventoryReceiving(
            cards,
            req.currentLocation
        );

        await addCardsToReceivingRecords({
            cards,
            employeeNumber: req.lightspeedEmployeeNumber,
            location: req.currentLocation,
            userId: req.userId,
            customerName,
            customerContact,
        });

        res.status(200).send(messages);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/suspendSale', async (req: RequestWithUserInfo, res) => {
    try {
        const message = await getSuspendedSales(req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

router.get('/suspendSale/:id', async (req: RequestWithUserInfo, res) => {
    const { id } = req.params;

    try {
        const message = await getSuspendedSale(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

router.post('/suspendSale', async (req: ReqWithSuspendSale, res) => {
    const schema = Joi.object<SuspendSaleBody>({
        customerName: validString.min(3).max(100).required(),
        notes: validString.min(0).max(255).allow(''),
        saleList: Joi.array().items(
            Joi.object<FinishSaleCard>({
                id: validStringRequired,
                price: validPrice,
                qtyToSell: validInteger,
                name: validStringRequired,
                set_name: validStringRequired,
                finishCondition: validFinishConditions,
            })
        ),
    });

    const { customerName = '', notes = '', saleList = [] } = req.body;

    const { error }: JoiValidation<SuspendSaleBody> = schema.validate(
        req.body,
        {
            abortEarly: false,
            allowUnknown: true,
        }
    );

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const message = await createSuspendedSale(
            customerName,
            notes,
            saleList,
            req.currentLocation
        );
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

router.delete('/suspendSale/:id', async (req: RequestWithUserInfo, res) => {
    const { id } = req.params;

    try {
        const message = await deleteSuspendedSale(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

export interface GetCardsByFilterQuery {
    title?: string;
    setName?: string;
    format?: FormatLegality;
    price?: number;
    finish?: Finish;
    colors?: string;
    sortBy?: SortBy;
    colorSpecificity?: ColorSpecificity;
    type?: TypeLine;
    frame?: Frame;
    priceOperator: PriceFilter;
    sortByDirection: SortByDirection;
    page: number;
}

router.get('/getCardsByFilter', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<GetCardsByFilterQuery>({
        title: validString,
        setName: validString,
        format: validFormatLegalities,
        price: Joi.number().positive().allow(0),
        finish: validFinish,
        colors: validString,
        sortBy: validSort,
        colorSpecificity: validColorSpecificity,
        type: validTypeline,
        frame: validFrame,
        priceOperator: validPriceOperator,
        sortByDirection: validSortDirection,
        page: Joi.number().integer().min(1).required(),
    });

    const { error, value }: JoiValidation<GetCardsByFilterQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const { currentLocation } = req;

        const message = await getCardsByFilter(value, currentLocation);

        res.status(200).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getDistinctSetNames', async (req: RequestWithUserInfo, res) => {
    try {
        const names = await getDistinctSetNames(req.currentLocation);
        res.status(200).send(names);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

interface GetCardsWithInfoQuery {
    title: string;
    matchInStock: boolean;
}

router.get('/getCardsWithInfo', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object({
        title: validStringRequired,
        matchInStock: Joi.boolean().required(),
    });

    const { error, value }: JoiValidation<GetCardsWithInfoQuery> =
        schema.validate(req.query, {
            abortEarly: false,
        });

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const { title, matchInStock } = value;

        const message = await getCardsWithInfo(
            title,
            matchInStock,
            req.currentLocation
        );
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

interface ReceivedCardQuery {
    startDate: string | null;
    endDate: string | null;
    cardName: string | null;
}

router.get('/getReceivedCards', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<ReceivedCardQuery>({
        startDate: validDate,
        endDate: validDate,
        cardName: validString.allow(null),
    });

    const { error, value }: JoiValidation<ReceivedCardQuery> = schema.validate(
        req.query,
        {
            abortEarly: false,
        }
    );

    if (error) {
        return res.status(400).json(error);
    }

    const { startDate, endDate, cardName } = value;

    try {
        const message = await getCardsFromReceiving({
            location: req.currentLocation,
            startDate: moment(startDate).utc().startOf('day').toDate(),
            endDate: moment(endDate).utc().endOf('day').toDate(),
            cardName: cardName || null,
        });

        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/getReceivedCards/:id', async (req: RequestWithUserInfo, res) => {
    const { id } = req.params;

    try {
        const message = await getReceivingById(id, req.currentLocation);
        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

interface SalesReportQuery {
    startDate: string | null;
    endDate: string | null;
}

router.get('/getSalesReport', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<SalesReportQuery>({
        startDate: validDate,
        endDate: validDate,
    });

    const { error, value }: JoiValidation<SalesReportQuery> = schema.validate(
        req.query,
        { abortEarly: false }
    );

    if (error) {
        return res.status(400).json(error);
    }

    const { startDate, endDate } = value;

    try {
        const message = await getSalesReport({
            location: req.currentLocation,
            startDate: moment(startDate).utc().startOf('day').toDate(),
            endDate: moment(endDate).utc().startOf('day').toDate(),
        });

        res.status(200).send(message);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

interface BulkSearchQuery {
    cardName: string;
}

router.get('/bulkSearch', async (req: RequestWithUserInfo, res) => {
    const schema = Joi.object<BulkSearchQuery>({
        cardName: validStringRequired,
    });

    const { error, value }: JoiValidation<BulkSearchQuery> = schema.validate(
        req.query,
        { abortEarly: false }
    );

    if (error) {
        return res.status(400).json(error);
    }

    try {
        const cards = await getCardPrintings(value.cardName);
        res.status(200).json(cards);
    } catch (err) {
        console.error(new Error(err));
        res.status(500).send(err.message);
    }
});

export default router;
