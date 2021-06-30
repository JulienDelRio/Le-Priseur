require('dotenv').config(); // Recommended way of loading dotenv
import container from "../inversify.config";
import {TYPES} from "./types";
import {LePriseurBot} from "./bot/le-priseur-bot";
import express from "express";
import path from "path";
import bodyParser from "body-parser";

export const app = express();
let env = process.env.NODE_ENV;
let botToken = process.env.BOT_TOKEN;

// App config
app.use(bodyParser.urlencoded({extended: true}));

// Bot
let bot = container.get<LePriseurBot>(TYPES.LePriseurBot);
bot.listen().then(() => {
    console.log('Logged in!')
}).catch((error) => {
    console.log('Oh no! ', error)
});

// Routes
// Root listener
app.get('/', (req, res) => {
    res.status(200).send('Le Priseur est en ligne.').end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});