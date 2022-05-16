// Importing the required modules
const WebSocketServer = require('ws');
 
// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 8080 })
var players = [];
var connections = [];
// Creating connection using websocket
wss.on("connection", ws => {
    console.log("Nova Conexão.");
    connections.push(ws);

    // sending message
    ws.on("message", data => {
        let msg = JSON.parse(data.toString());
        if (msg.type == 'appendPlayer') {
            let playerNum = Math.floor(Math.random() * 50);
            for (let i = 0; i < players.length;i++) {
                if (playerNum == players[i].numPlayer) {
                    playerNum = Math.floor(Math.random() * 50);
                    break;
                }
            }
            players.push({
                'numPlayer': playerNum,
                'x': msg.data.x,
                'y': msg.data.y,
                'level': msg.data.level,
                'state': msg.data.state
            });

            ws.send(JSON.stringify({
                'type': 'getMyNum',
                'data': {'playerNum': playerNum}
            }));
            ws.send(JSON.stringify({
                'type': 'getPlayers',
                'data': {'players': players}
            }));

        } else if (msg.type == 'updatePlayer') {
            for (let i = 0; i< players.length; i++) {
                if (players[i].numPlayer == msg.data.numPlayer) {
                    players[i].x = msg.data.x;
                    players[i].y = msg.data.y;
                    players[i].level = msg.data.level;
                    players[i].state = msg.data.state;
                }
            }
            for (let i = 0; i < connections.length; i ++) {
                connections[i].send(JSON.stringify({
                    'type': 'updatePlayer',
                    'data': {'players': players}
                }));
            }
        }
    }); 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has connected");
        console.log("Conexão Fechada.");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Ocorreu algum erro")
    }
});
console.log("The WebSocket server is running on port 8080");