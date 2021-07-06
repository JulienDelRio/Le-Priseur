import {Message} from "discord.js";
import {injectable} from "inversify";
import {AbstractCommand} from "./abstract-command";
import {IMessageInterpreter} from "./message-responder"

@injectable()
export class SellsCommand extends AbstractCommand {

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
}