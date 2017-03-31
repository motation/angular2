/**
 * Created by fedders on 30.03.2017.
 */
import {Injectable} from "@angular/core";
import {Websocket} from "./websocket";

@Injectable()
export class WebsocketService {
    private websocket:Websocket;
    private static handler:any = [];

    constructor() {
        var host:string = window.location.hostname;
        var port:string = window.location.port;
        this.websocket = new Websocket(host, port);
        this.websocket.addConnectionOpenCallback(()=> {
            console.log("connection is opened");
        })
        this.websocket.addReceiveCallback(this.messageHandler);
    }

    public onMessage(messageType:string, callback:Function, removeAfterExecution:Boolean):void {
        let handle:any = {};
        handle.messageType = messageType;
        handle.callback = callback;
        handle.remove = removeAfterExecution;
        WebsocketService.handler.push(handle);
    }

    public sendMessage(message:any):void {
        this.websocket.send(message);
    }

    private messageHandler = (message:any) => {
        let i = WebsocketService.handler.length;
        while (i--) {
            let handle:any = WebsocketService.handler[i];
            let data:any = JSON.parse(message.data);
            if (data.type === handle.messageType) {
                handle.callback(data);
            }
            if (handle.remove) {
                WebsocketService.handler.splice(i, 1);
            }
        }
    }

}