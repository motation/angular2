/**
 * Created by fedders on 31.03.2017.
 */
import {Component} from "@angular/core";
import {WebsocketService} from "../websocket/websocketService";
@Component({
    templateUrl: '/app/sequence/sequence.component.html'
})
export class SequenceComponent {

    private static REQUEST_SEQUENCE:string = "request_sequence";
    private static RESPONSE_SEQUENCE:string = "response_sequence";

    public sequences:any = [];

    constructor(private websocketService:WebsocketService) {
        let removeAfterExecution:Boolean = true;
        this.websocketService.onMessage(SequenceComponent.RESPONSE_SEQUENCE, this.loadSequence, removeAfterExecution);
        this.initSequence();
    }

    private initSequence():void {
        let message:any = {};
        message.type = SequenceComponent.REQUEST_SEQUENCE;
        this.websocketService.sendMessage(JSON.stringify(message));
    }

    private loadSequence = (data:any)=> {
        console.log(data);
        for (let i in data.sequences.data) {
            let sequence = data.sequences.data[i];
            sequence.url = data.player + sequence.id + "%2Ftype%2Fsequence";
        }
        this.sequences = data.sequences.data;
    }
}