import {Message} from "discord.js";
import {PingFinder} from "./ping-finder";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {SellsCommandInterpreter} from "./sells-command-interpreter";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private sellsCommand: SellsCommandInterpreter;

    constructor(
        @inject(TYPES.PingFinder) pingFinder: PingFinder, @inject(TYPES.SellsCommand) sellsCommand: SellsCommandInterpreter
    ) {
        this.pingFinder = pingFinder;
        this.sellsCommand = sellsCommand;
    }

    handle(message: Message): Promise<Message | Message[]> {
        if (this.pingFinder.isPing(message.content)) {
            return message.reply('pong!');
        } else if (this.sellsCommand.isHandled(message)) {
            return this.sellsCommand.handle(message)
        }

        return Promise.reject();
    }
}

export interface IMessageInterpreter {
    isHandled(message: Message): boolean;

    handle(message: Message): Promise<Message | Message[]>;
}

