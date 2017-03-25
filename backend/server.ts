/**
 * Created by unknown on 25.03.17.
 */
import http = require('http');

export class Server {

    private static PORT: number = 8081;
    private static REQUEST: string = "request";
    private server: any;
    private websocketServer: any;

    public start(): void {
        this.server = http.createServer();
        this.server.on(Server.REQUEST, this.onRequest)
        this.server.listen(Server.PORT);

        var Websocket = require('websocket').server;
        this.websocketServer = new Websocket({
            httpServer: this.server,
            autoAcceptConnections: false
        });

        this.websocketServer.on('request', function (request: any) {
            if (!this.originIsAllowed(request.origin)) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
                return;
            }

            var connection = request.accept('echo-protocol', request.origin);
            console.log((new Date()) + ' Connection accepted.');
            connection.on('message', function (message: any) {
                if (message.type === 'utf8') {
                    console.log('Received Message: ' + message.utf8Data);
                    connection.sendUTF(message.utf8Data);
                }
                else if (message.type === 'binary') {
                    console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                    connection.sendBytes(message.binaryData);
                }
            });
            connection.on('close', function (reasonCode: any, description: any) {
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            });
        });

    }

    private originIsAllowed(origin: any): Boolean {
        return true;
    }

    private onRequest = (request: any, response: any) => {
        console.log(request.url);
    }
}

var server: Server = new Server();
server.start();