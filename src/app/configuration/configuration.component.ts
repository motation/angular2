import {WebsocketService} from "../websocket/websocketService";
import {Component} from "@angular/core";
/**
 * Created by fedders on 30.03.2017.
 */


@Component({
    templateUrl: '/app/configuration/configuration.component.html'
})
export class ConfigurationComponent {

    private static REQUEST_PROPERTY:string = "request_property";
    private static REQUEST_CHANGE_PROPERTY:string = "request_change_property";
    private static RESPONSE_PROPERTY:string = "response_property";

    public values:any = [];

    constructor(private websocketService:WebsocketService) {
        let removeAfterExecution:Boolean = true;
        this.websocketService.onMessage(ConfigurationComponent.RESPONSE_PROPERTY, this.loadConfiguration,
            removeAfterExecution);
        this.initConfiguration();
    }

    private initConfiguration():void {
        let message:any = {};
        message.type = ConfigurationComponent.REQUEST_PROPERTY;
        this.websocketService.sendMessage(JSON.stringify(message));
    }

    private loadConfiguration = (configuration:any) => {
        this.values = [];
        for (let item in configuration.data) {
            let value:any = {};
            value.key = item;
            value.value = configuration.data[item];
            this.values.push(value);
        }
    }

    private save():void {
        let json:any = {};
        json.type = ConfigurationComponent.REQUEST_CHANGE_PROPERTY;
        json.data = {};
        for (let i in this.values) {
            let key:any = this.values[i].key;
            let value:any = this.values[i].value;
            json.data[key] = value;
        }
        this.websocketService.sendMessage(JSON.stringify(json));
    }
}