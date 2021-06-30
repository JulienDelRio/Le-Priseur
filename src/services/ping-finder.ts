import {Message} from "discord.js";
import {injectable} from "inversify";
import {IMessageInterpreter} from "./message-responder"

@injectable()
export class PingFinder implements IMessageInterpreter {

    isHandled(message: Message): boolean {
        return this.isPing(message.content)
    }

    handle(message: Message): Promise<Message | Message[]> {
        return message.reply('pong!');
    }

    private regexp = 'ping';

    isPing(stringToSearch: string): boolean {
        return stringToSearch.search(this.regexp) >= 0;
    }
}