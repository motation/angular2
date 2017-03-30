import {WebsocketService} from "../websocket/websocketService";
import {Component} from "@angular/core";
/**
 * Created by fedders on 30.03.2017.
 */


@Component({
    templateUrl: '/app/configuration/configuration.component.html'
})
export class ConfigurationComponent {

    public values:any = [];

    constructor(private websocketService:WebsocketService) {
        this.websocketService.onMessage("response_property", this.loadData);
        this.initConfig();
    }

    private initConfig():void {
        let message:any = {};
        message.type = "request_property";
        this.websocketService.sendMessage(JSON.stringify(message));
    }

    private loadData = (data:any) => {
        this.values = [];
        for (let item in data.data) {
            let value:any = {};
            value.key = item;
            value.value = data.data[item];
            this.values.push(value);
        }
    }

    private save():void {
        let json:any = {};
        json.type = "request_change_property";
        json.data = {};
        for (let item in this.values) {
            json.data[this.values[item].key] = this.values[item].value;
        }
        this.websocketService.sendMessage(JSON.stringify(json));
    }
}