import {Message} from "discord.js";
import {injectable} from "inversify";
import {AbstractCommandInterpreter} from "./abstract-command-interpreter";
import {IMessageInterpreter} from "./message-responder"
import * as Console from "console";
import moment, {Moment} from "moment";
import {emojiCharacters} from "../utils/emojicharacters";
import disbut from 'discord-buttons';

@injectable()
export class SellsCommandInterpreter extends AbstractCommandInterpreter {
    private pastCommandMessages: Message[] = [];

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
            let sentCommand = this.getSellCommand(splittedCommand);
            let sellPromise = this.handleSellCommand(message, sentCommand);
            sellPromise.then(postedMessageOrMessages => {
                if (Array.isArray(postedMessageOrMessages)) {
                    let postedMessages: Message[] = <Message[]>postedMessageOrMessages;
                    for (const postedMessage of postedMessages) {
                        this.postProdCommand(postedMessage, sentCommand);
                    }
                } else {
                    let postedMessage: Message = <Message>postedMessageOrMessages;
                    this.postProdCommand(postedMessage, sentCommand);
                }
            })
            return sellPromise;
        }
    }

    private postProdCommand(postedMessage: Message, sentCommand: SellCommand) {
        this.pastCommandMessages.push(postedMessage);
        postedMessage.react(emojiCharacters[1]);
        postedMessage.react(emojiCharacters[2]);
        postedMessage.react(emojiCharacters[3]);
        postedMessage.react(emojiCharacters[4]);
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
        let shopPrice: number = sendCommand.ressourceCount * getRessourceTypeSpec(sendCommand.ressourceType).shopPrice;
        let contentMessage = "Je vends " + sendCommand.ressourceCount + " " + sendCommand.ressourceType + ":meat_on_bone: \n" +
            "Prix de départ : " + sendCommand.ressourcePrice + "/u, (+ " + shopPrice + " berrys de frais de" +
            " boutique)\n" +
            "Enchères 💸 : + " + sendCommand.bidStep + "/u minimum\n" +
            "\n" +
            "Fin de l'enchère : " + sendCommand.dateLimit.format("DD/MM/YY à HH:mm") + "\n" +
            "\n" +
            "<@!" + message.author.id + ">";
        let button = new disbut.MessageButton()
            .setStyle('red')
            .setLabel('My First Button!')
            .setID('click_to_function');
        return message.channel.send(contentMessage, button);
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

        // Check price per res
        let param5 = params[4];
        let dateLimit: Moment = moment(param5, "D/M-H:m", true);
        if (!dateLimit.isValid()) {
            console.log(dateLimit.parsingFlags())
            throw this.getErrorNotGoodParam("de la date limite")
        }

        return new SellCommand(resCount, resType, resPrice, bidStep, dateLimit);
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
    private _ressourceCount: number;
    private _ressourcePrice: number;
    private _bidStep: number;
    private _dateLimit: Moment;

    constructor(resCount: number, resType: RessourceType, resPrice: number, bidStep: number, dateLimit: Moment) {
        this._ressourceCount = resCount;
        this._ressourceType = resType;
        this._ressourcePrice = resPrice;
        this._bidStep = bidStep;
        this._dateLimit = dateLimit;
    }


    get ressourceType(): RessourceType {
        return this._ressourceType;
    }

    get ressourceCount(): number {
        return this._ressourceCount;
    }

    get ressourcePrice(): number {
        return this._ressourcePrice;
    }

    get bidStep(): number {
        return this._bidStep;
    }

    get dateLimit(): Moment {
        return this._dateLimit;
    }
}

enum RessourceType {
    Meats = "viandes",
    Tools = "outils"
}

interface RessourceTypeSpec {
    label: string,
    shopPrice: number
}

function getRessourceTypeSpec(ressourceType: RessourceType): RessourceTypeSpec {
    switch (ressourceType) {
        case RessourceType.Meats:
            return {
                label: "viandes",
                shopPrice: 10
            }
        case RessourceType.Tools:
            return {
                label: "outils",
                shopPrice: 10
            }
    }
}
