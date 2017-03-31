/**
 * Created by fedders on 30.03.2017.
 */
import {Component} from "@angular/core";
import {WebsocketService} from "../websocket/websocketService";
@Component({
    templateUrl: '/app/exercises/exercises.component.html'
})
export class ExercisesComponent {

    private static REQUEST_EXERCISES:string = "request_exercises";
    private static RESPONSE_EXERCISES:string = "response_exercises";

    public exercises:any = [];

    constructor(private websocketService:WebsocketService) {
        let removeAfterExecution:Boolean = true;
        this.websocketService.onMessage(ExercisesComponent.RESPONSE_EXERCISES, this.loadExercises, removeAfterExecution);
        this.initExercises();
    }

    private initExercises():void {
        let message:any = {};
        message.type = ExercisesComponent.REQUEST_EXERCISES;
        this.websocketService.sendMessage(JSON.stringify(message));
    }

    private loadExercises = (data:any)=> {

        this.exercises = data.exercises.data;

        console.log(data);
        for (let i in data.exercises.data) {
            let exercise = data.exercises.data[i];
            exercise.url = data.player + exercise.id + "%2Ftype%2Fexercise";
        }
        this.exercises = data.exercises.data;


    }
}