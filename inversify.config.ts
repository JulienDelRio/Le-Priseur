import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./src/types";
import {LePriseurBot} from "./src/bot/le-priseur-bot";
import {Client} from "discord.js";
import { MessageResponder } from "./src/services/message-responder";
import { PingFinder } from "./src/services/ping-finder";

let container = new Container();

container.bind<LePriseurBot>(TYPES.LePriseurBot).to(LePriseurBot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.BOT_TOKEN);
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<PingFinder>(TYPES.PingFinder).to(PingFinder).inSingletonScope();

export default container;

// Make process available
declare var process: {
    env: {
        BOT_TOKEN: string
    }
}