export class Websocket {
    private connection:WebSocket;

    constructor(port:string) {
        this.connection = new WebSocket("ws://localhost:" + port, 'echo-protocol');
    }

    public addConnectionOpenCallback = function (callback:Function) {
        this.connection.onopen = function (event:any) {
            callback(event);
        }
    }

    public send(message:any) {
        this.connection.send(message);
    }

    public addReceiveCallback = function (callback:Function) {
        this.connection.onmessage = function (message:any) {
            callback(message);
        }
    }
}