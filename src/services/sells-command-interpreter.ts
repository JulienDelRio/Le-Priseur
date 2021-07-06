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
            throw this.getErrorNotEnoughParam()
        } else if (splittedCommand[0].match("aide")) {
            return this.handleSellHelp(message);
        } else if (splittedCommand.length < 5) {
            throw this.getErrorNotEnoughParam()
        } else {
            let sendCommand = this.getSellCommand(splittedCommand);
            return this.handleSellCommand(message, sendCommand)
        }
    }

    private getErrorNotEnoughParam() {
        return new Error("Il manque des informations.\n" +
            "Pour plus d'informations : =vendre aide");
    }

    private getErrorNotGoodParam(value: string) {
        return new Error("La valeur " + value + " n'est pas bien renseignée.\n" +
            "Pour plus d'informations : =vendre aide");
    }

    private handleSellCommand(message: Message, sendCommand: SellCommand): Promise<Message | Message[]> {
        return message.channel.send("Je vends " + sendCommand.ressourceCount + " " + sendCommand.ressourceType + ":meat_on_bone: \n" +
            "Prix de départ : " + sendCommand.ressourcePrice + "/u, (+ frais de la boutique)\n" +
            "Enchères 💸 : + " + sendCommand.bidStep + "/u minimum\n" +
            "\n" +
            "Fin de l'enchère : XXhXX\n" +
            "\n" +
            "<@!" + message.author.id + ">");
    }

    private getSellCommand(params: string[]): SellCommand {
        if (params.length < 5) {
            throw this.getErrorNotEnoughParam();
        }

        // Check res count
        let param1 = params[0];
        let resCount = parseInt(param1);
        if (isNaN(resCount))
            throw this.getErrorNotGoodParam("du nombre d'unités")

        // Check res type
        let param2 = params[1];
        let resType: RessourceType;
        switch (param2) {
            case "viandes":
                resType = RessourceType.Meats;
                break
            case "outils":
                resType = RessourceType.Tools;
                break
            default :
                throw this.getErrorNotGoodParam("du type de ressource")
        }

        // Check price per res
        let param3 = params[2];
        let resPrice = parseInt(param3);
        if (isNaN(resPrice))
            throw this.getErrorNotGoodParam("du prix de la ressource")

        // Check price per res
        let param4 = params[3];
        let bidStep = parseInt(param4);
        if (isNaN(bidStep))
            throw this.getErrorNotGoodParam("du palier d'enchère")

        return new SellCommand(resCount, resType, resPrice, bidStep);
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
    private _ressourceType: RessourceType;
    private _ressourceCount: Number;
    private _ressourcePrice: Number;
    private _bidStep: Number;

    constructor(resCount: Number, resType: RessourceType, resPrice: Number, bidStep: Number) {
        this._ressourceCount = resCount;
        this._ressourceType = resType;
        this._ressourcePrice = resPrice;
        this._bidStep = bidStep;
    }


    get ressourceType(): RessourceType {
        return this._ressourceType;
    }

    get ressourceCount(): Number {
        return this._ressourceCount;
    }

    get ressourcePrice(): Number {
        return this._ressourcePrice;
    }

    get bidStep(): Number {
        return this._bidStep;
    }
}

enum RessourceType {
    Meats = "viandes",
    Tools = "outils"
}
