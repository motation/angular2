import {WebsocketService} from "../websocket/websocketService";
import {Component} from "@angular/core";
/**
 * Created by fedders on 30.03.2017.
 */


@Component({
    templateUrl: '/app/configuration/configuration.component.html'
})
export class ConfigurationComponent {
    constructor(private websocketService:WebsocketService) {

    }
}