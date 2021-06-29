import express from "express";
import path from "path";
import bodyParser from "body-parser";
import {LePriseurBot} from "./bot/LePriseurBot";

export const app = express();
let env = process.env.NODE_ENV;
let botToken = process.env.BOT_TOKEN;

// App config
app.use(bodyParser.urlencoded({extended: true}));

// Bot
const bot = new LePriseurBot(botToken);

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

// Make process available
declare var process : {
    env: {
        NODE_ENV: string,
        BOT_TOKEN: string,
        PORT: number
    }
}