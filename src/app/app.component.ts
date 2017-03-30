import {Component} from "@angular/core";
import {WebsocketService} from "./websocket/websocketService";

@Component({
    selector: 'my-app',
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {
    constructor(private websocketService:WebsocketService) {
        
    }
}
