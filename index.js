import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let countR = 0;
let countL = 0;

wss.on('connection', (ws) => {
    // Send the current counts to the newly connected client
    ws.send(JSON.stringify({ countR, countL }));
  
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const side = data.side; // "right" or "left"
        
        if (side === "right") {
            countR++;
        } else if (side === "left") {
            countL++;
        }

        console.log(`Button ${side} was clicked`);
        console.log(`countR: ${countR}, countL: ${countL}`);
        
        // Broadcast the updated counts and button click to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ countR, countL, side }));
            }
        });
    });
});

console.log('WebSocket server is running on ws://localhost:8080');