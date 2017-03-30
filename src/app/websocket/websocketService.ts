/**
 * Created by fedders on 30.03.2017.
 */
import {Injectable} from "@angular/core";
import {Websocket} from "./websocket";

@Injectable()
export class WebsocketService {
    private websocket:Websocket;

    constructor() {
        //OF TODO load port from conf
        this.websocket = new Websocket("3000");
    }

    public getWebsocket():Websocket {
        return this.websocket;
    }
}