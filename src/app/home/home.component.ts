import {Component} from "@angular/core";
import {WebsocketService} from "../websocket/websocketService";
/**
 * Created by unknown on 25.03.17.
 */

@Component({
    templateUrl: '/app/home/home.component.html'
})

export class HomeComponent {

    constructor(private websocketService:WebsocketService) {

        this.websocketService.getWebsocket().addConnectionOpenCallback((event:any)=> {
            this.websocketService.getWebsocket().send("hello");
        });

        this.websocketService.getWebsocket().addReceiveCallback((message:any)=> {
            console.log(message);
        });
    }
}