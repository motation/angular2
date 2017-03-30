/**
 * Created by fedders on 30.03.2017.
 */
import {Injectable} from "@angular/core";
import {Websocket} from "./websocket";

@Injectable()
export class WebsocketService {
    private websocket:Websocket;

    constructor() {
        var host:string = window.location.hostname;
        var port:string = window.location.port;
        this.websocket = new Websocket(host,port);
    }

    public getWebsocket():Websocket {
        return this.websocket;
    }
}