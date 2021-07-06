import {Message} from "discord.js";
import {injectable} from "inversify";
import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {IMessageInterpreter} from "./message-responder"
import * as Console from "console";

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

    private handleSell(message: Message): Promise<Message | Message[]> {
        let fullCommand = this.getFullCommand(message);
        let splittedCommand = fullCommand.split(" ");
        let command = splittedCommand.shift();
        if (splittedCommand.length == 0) {
            throw new Error("Il manque des informations.\n" +
                "Pour plus d'informations : =vendre aide")
        } else if ("aide".match(splittedCommand[0])) {
            return this.handleSellHelp(message);
        } else if (splittedCommand.length < 5) {
            throw new Error("Il manque des informations.\n" +
                "Pour plus d'informations : =vendre aide")
        } else {
            let sendCommand = this.getSellCommand(splittedCommand);
            return this.handleSellCommand(sendCommand)
        }
    }

    private handleSellCommand(sendCommand: SellCommand): Promise<Message | Message[]> {
        throw new Error("Method not implemented.");
    }

    private getSellCommand(params: string[]): SellCommand {

        return new SellCommand(RessourceType.Meats);
    }

    private handleSellHelp(message: Message): Promise<Message | Message[]> {
        return message.reply('fonctionnemment de la commande VENDRE :\n' +
            '=vendre AA BB CC DD EE\n' +
            '- AA = Nombre de ressources en vente\n' +
            '- BB = type de ressource parmis viandes, outils\n' +
            '- CC = prix par unité\n' +
            '- DD = palier d\'enchère\n' +
            '- EE = date de fin au format JJ/MM-HH:MM\n' +
            'Ex : =vendre 200 viandes 10 1 10/07-14:00\n' +
            'Donnera une vente de 200 viandes, au prix de 10 berrys l\'unité (+ frais de boutique), enchère à 1' +
            ' berry de plus, se cloture le 10:07 à 14:00');
    }

}

class SellCommand {
    private ressource: RessourceType;

    constructor(ressourceType: RessourceType) {
        this.ressource = ressourceType;
    }

}

enum RessourceType {
    Meats,
    Tools,
    EternalPose
}
