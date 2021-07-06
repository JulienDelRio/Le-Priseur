import {Message} from "discord.js";
import {injectable} from "inversify";
import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {IMessageInterpreter} from "./message-responder"

@injectable()
export class SellsCommandInterpreter extends AbstractCommandInterpreter {

    isHandled(message: Message): boolean {
        switch (this.getCommand(message)) {
            case "vendre":
                return true;
            default :
                return false;
        }
    }

    handle(message: Message): Promise<Message | Message[]> {
        switch (this.getCommand(message)) {
            case "vendre":
                return this.handleSell(message);
            default :
                return Promise.reject();
        }
    }

    handleSell(message: Message) {
        return message.reply('VENDU')
    }

    getSellCommand(message: Message): SellCommand {
        return new SellCommand("coucou");
    }

}

class SellCommand {
    private ressource: string;

    constructor(ressource: string) {
        this.ressource = ressource;
    }

}