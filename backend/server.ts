/**
 * Created by unknown on 25.03.17.
 */
import http = require('http');
import finalHandler = require('finalhandler');
import serveStatic = require('serve-static');

import path = require('path');
import {FileReader} from "./fileReader";

import request = require('request');

export class Server {

    private static PORT:number = 3000;
    private static REQUEST:string = "request";
    private static CONFIG_SRC:string = "./backend/props/config.json";

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
                    FileReader.readConfig(Server.CONFIG_SRC, (data:any)=> {
                        let obj:any = {};
                        obj.data = JSON.parse(data);
                        obj.type = "response_property";
                        connection.send(JSON.stringify(obj));
                    });
                    break;
                }
                case "request_change_property":
                {
                    let data:any = JSON.parse(message.utf8Data);
                    FileReader.writeConfig(Server.CONFIG_SRC, JSON.stringify(data.data));
                    break;
                }
                case "request_exercises":
                {
                    FileReader.readConfig(Server.CONFIG_SRC, (data:any)=> {
                        let obj:any = {};
                        obj.data = JSON.parse(data);

                        let base64UserPass:string = new Buffer(obj.data.apiUser + ":" + obj.data.apiPass).toString('base64');

                        obj.type = "response_exercises";
                        let consumerId:string = obj.data.consumerId;
                        let player:string = obj.data.player + consumerId + "&path=%2Fresult%2Fid%2F";
                        obj.player = player;
                        let url:string = obj.data.api + "/exercise?consumerId=" + consumerId;

                        request({
                            url: url,
                            method: "POST",
                            json: true,
                            body: {},
                            headers: {"Authorization": "Basic " + base64UserPass, "Content-Type": "application/json"}
                        }, function (error, response, body) {
                            obj.exercises = body;
                            delete obj.data;
                            connection.send(JSON.stringify(obj));
                        });
                    });
                    break;
                }

                case "request_sequence":
                {
                    FileReader.readConfig(Server.CONFIG_SRC, (data:any)=> {
                        let obj:any = {};

                        obj.data = JSON.parse(data);

                        let base64UserPass:string = new Buffer(obj.data.apiUser + ":" + obj.data.apiPass).toString('base64');

                        obj.type = "response_sequence";
                        let consumerId:string = obj.data.consumerId;
                        let backendCallback:string = obj.data.backendCallback;
                        let player:string = obj.data.player + consumerId + "&path=%2Fresult%2Fid%2F";
                        obj.player = player;
                        let url:string = obj.data.api + "/sequence?consumerId=" + consumerId;
                        request({
                            url: url,
                            method: "POST",
                            json: true,
                            body: {},
                            headers: {"Authorization": "Basic " + base64UserPass, "Content-Type": "application/json"}
                        }, function (error, response, body) {
                            obj.sequences = body;
                            delete obj.data;
                            connection.send(JSON.stringify(obj));
                        });
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
            let id:string = this.parseForId(request.url);
            let type:string = this.parseForType(request.url);
            let jsonfy:string = JSON.stringify({type: type, playerItemId: id});
            response.end(jsonfy);
        }
        serve(request, response, done);
    }

    private parseForType(url:string):string {
        let idx = url.indexOf("type");
        let type = url.substr(idx).replace("type/", "");
        return type;
    }

    private parseForId(url:string):string {
        let idx = url.indexOf("id");
        let id = url.substr(idx).replace("id/", "");
        let idx2 = id.indexOf("/");
        id = id.substr(0, idx2);
        return id;
    }


}

var server:Server = new Server();
server.start();