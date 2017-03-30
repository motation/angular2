/**
 * Created by unknown on 25.03.17.
 */
import http = require('http');
import finalHandler = require('finalhandler');
import serveStatic = require('serve-static');

import path = require('path');
import {FileReader} from "./fileReader";

export class Server {

    private static PORT:number = 3000;
    private static REQUEST:string = "request";

    private static REQUEST_MAPPING_NODE_MODULES:string = "node_modules";
    private static REQUEST_MAPPING_API:string = "result";

    private static NODE_MODULES_PATH:string = "./";
    private static APP_PATH:string = "./src";

    private server:any;
    private websocketServer:any;

    public start():void {
        this.server = http.createServer();
        this.server.on(Server.REQUEST, this.onRequest);
        this.server.listen(Server.PORT);
        this.initWebsocket();
    }


    private initWebsocket():void {
        var Websocket = require('websocket').server;
        this.websocketServer = new Websocket({
            httpServer: this.server,
            autoAcceptConnections: false
        });

        this.websocketServer.on('request', (request:any) => {
            if (!this.originIsAllowed(request.origin)) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
                return;
            }

            var connection = request.accept('echo-protocol', request.origin);
            console.log((new Date()) + ' Connection accepted.');
            connection.on('message', (message)=> {
                this.onWSMessage(connection, message);
            });
            connection.on('close', (reasonCode:any, description:any) => {
                this.onWSClose(connection, reasonCode, description);
            });
        });
    }

    private onWSMessage = (connection, message:any) => {
        if (message.type === 'utf8') {
            let json:any = JSON.parse(message.utf8Data);
            switch (json.type) {
                case "request_property":
                {
                    FileReader.readJSONFile("./backend/props/config.json", (data:any)=> {
                        json.data = JSON.parse(data);
                        json.type = "response_property";
                        connection.send(JSON.stringify(json));
                    });
                    break;
                }
            }
        }
    }

    private onWSClose = (connection, reasonCode:any, description:any) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    }

    private urlContains(url:string, part:string):Boolean {
        return url.indexOf(part) > -1;
    }


    private originIsAllowed(origin:any):Boolean {
        return true;
    }

    private onRequest = (request:any, response:any) => {

        var done = finalHandler(request, response);
        var serve = serveStatic(Server.APP_PATH);
        var url:string = request.url;

        if (this.urlContains(url, Server.REQUEST_MAPPING_NODE_MODULES)) {
            serve = serveStatic(Server.NODE_MODULES_PATH);
        } else if (this.urlContains(url, Server.REQUEST_MAPPING_API)) {
            //OF TODO impl backend api
        }
        serve(request, response, done);
    }


}

var server:Server = new Server();
server.start();