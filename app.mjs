import * as dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 3000;

const SPARKO_URL = process.env.SPARKO_URL;
const SPARKO_KEY = process.env.SPARKO_KEY;

import SparkoClient from 'sparko-client';
const sparko = SparkoClient(SPARKO_URL, SPARKO_KEY);

import { nip57, validateEvent, verifySignature } from 'nostr-tools';

const asyncHandler = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next))
        .catch(next);
}

import { v4 as uuidv4 } from 'uuid';

import express from 'express';
import { check, query, validationResult } from 'express-validator';
const app = express();
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, access_token'
    )

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200)
    } else {
        next()
    }
}
app.use(allowCrossDomain);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/api/v1/lnurl/payreq',
    [
        query('amount').exists().isInt({ min: 1000 }),
    ],
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        let amount = req.query.amount;
        let comment = req.query.comment;
        let description = "Zap from LUD-16";

        if (req.query.nostr !== undefined) {
            if (nip57.validateZapRequest(req.query.nostr)) {
                return res.status(422).json({ errors: nip57.validateZapRequest(req.query.nostr) });
            } else {
                description = req.query.nostr;
            }
        }

        let invoice_data = {
            amount_msat: amount,
            label: uuidv4(),
            description: description,
            deschashonly: true
        }

        let { bolt11, preimage } = await sparko.call("invoice", invoice_data);
        return res.status(200).json(
            {
                pr: bolt11,
                routes: [],
            }
        );
    }));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
