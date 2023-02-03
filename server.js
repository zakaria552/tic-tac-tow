const express = require("express")
const {WebSocketServer, WebSocket} = require("ws")
const http = require("http")
const {PORT, CLIENT, SERVER} = require("./src/utils/constants")

const server = http.createServer()
const wsServer = new WebSocketServer({server})
const roles = ["o", "x"]
const selectedRoles = []

server.listen(PORT ,() => {
    console.log("Websocket is running on port", PORT)
})

wsServer.on("connection", (socket) => {
    console.log("Client has connected")
    socket.send("hello from the the server side")
    socket.on("message", (data) => {
        const {type, payload} = JSON.parse(data)
        switch(type) {
            case CLIENT.MESSAGES.NEW_USER:
                roleAsignment(socket)
                break;
            case CLIENT.MESSAGES.START_GAME:
                const zeroOrOne = Math.floor(Math.random() * 2)
                broadcast({type: SERVER.BROADCAST.STARTING_GAME, payload: {playerTurn: roles[zeroOrOne]}})
                break;
            case CLIENT.MESSAGES.TURN_PLAYED:
                console.log(type, payload.move)
                let move = payload.move
                let message = {type: SERVER.BROADCAST.TURN_BEEN_PLAYED, payload: {move}}
                broadcast(message, socket)
                break;
            default:
                break;
        }
        console.log(payload.message)
    })
})

function roleAsignment(socket) {
    const message = {type: SERVER.MESSAGES.ROLE_ASIGNMENT, payload: {}}
    // const message2 = {type: SERVER.BROADCAST.START_GAME, payload: {playerTurn: roles[zeroOrOne] }}
    const message2 = {type: SERVER.MESSAGES.READY_TO_BEGIN}
    if(selectedRoles.length === 0) {
        message.payload.role = roles[0]
        selectedRoles.push(roles[0])
    } else if(selectedRoles.length === 1) {
        message.payload.role = roles[1]
        selectedRoles.push(roles[1])
    } else {
        message.type = SERVER.MESSAGES.GAME_IS_FULL
    }
    socket.send(JSON.stringify(message))
    // if(selectedRoles.length === 2) {
    //    setTimeout(() =>  broadcast(message2), 2000)
    // }
}

function broadcast(message, socketToOmit) {
    console.log("Broadcasting")
    wsServer.clients.forEach(connectedClient => {
        if(connectedClient.readyState === WebSocket.OPEN && connectedClient !== socketToOmit){
            connectedClient.send(JSON.stringify(message))
        }
    });
}