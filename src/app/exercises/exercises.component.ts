/**
 * Created by fedders on 30.03.2017.
 */
import {Component} from "@angular/core";
import {WebsocketService} from "../websocket/websocketService";
@Component({
    templateUrl: '/app/exercises/exercises.component.html'
})
export class ExercisesComponent {

    private exercises:any = [];

    constructor(private websocketService:WebsocketService) {
        this.websocketService.onMessage("response_exercises", this.loadExercises);
        this.initExercises();
    }

    private initExercises():void {
        let message:any = {};
        message.type = "request_exercises";
        this.websocketService.sendMessage(JSON.stringify(message));
    }

    private loadExercises = (exercises:any)=> {
        console.log(exercises);
    }
}