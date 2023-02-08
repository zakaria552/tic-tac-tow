const express = require("express")
const {WebSocketServer, WebSocket} = require("ws")
const http = require("http")
const {PORT, CLIENT, SERVER} = require("./src/utils/constants")

const server = http.createServer()
const wsServer = new WebSocketServer({server})
const publicGames = [] // [{},{},....] -> {roles:[], clients:[]}
const roles = ["o", "x"]
let clientsInServer = 0
server.listen(PORT ,() => {
    console.log("Websocket is running on port", PORT)
})

wsServer.on("connection", (socket) => {
    console.log("Client has connected")
    socket.send("hello from the the server side")
    socket.on("message", (data) => {
        const {type, payload} = JSON.parse(data)
        const zeroOrOne = Math.floor(Math.random() * 2)
        switch(type) {
            case CLIENT.MESSAGES.NEW_USER:
                clientsInServer++
                socket.send(JSON.stringify({type: SERVER.MESSAGES.SERVER_INFO, payload: {clientsInServer}}))
                broadcast({type: SERVER.MESSAGES.SERVER_INFO, payload: {clientsInServer}}, socket)
                break;
            case CLIENT.MESSAGES.FIND_GAME:
                findGame(socket)
                break;
            case CLIENT.MESSAGES.START_GAME:
                console.log("start loop?")
                setTimeout(() => broadcast({type: SERVER.BROADCAST.STARTING_GAME, payload: {playerTurn: roles[zeroOrOne]}}), 500)
                break;
            case CLIENT.MESSAGES.RESTART_GAME:
                let message1 = {type: SERVER.BROADCAST.STARTING_GAME, payload: {playerTurn: roles[zeroOrOne], restart: true}}
                setTimeout(() => broadcastGame(message1, socket, true), 500)
                break;
            case CLIENT.MESSAGES.TURN_PLAYED:
                console.log(payload)
                let message = {type: SERVER.BROADCAST.TURN_BEEN_PLAYED, payload: {move: payload.move}}
                if(payload.gameState.won) message.type = SERVER.BROADCAST.GAME_LOST
                if(payload.gameState.draw) message.type = SERVER.BROADCAST.GAME_DRAW
                broadcastGame(message, socket)
                break;
            default:
                break;
        }
        // console.log(payload.message)
    })
})
const findGame = (socket) => {
    const message = {type: SERVER.MESSAGES.ROLE_ASIGNMENT, payload: {}}
    const lastIndex = publicGames.length - 1
    let room = publicGames[lastIndex]
    if(!room) {
        // {roles:[], clients:[]}
        let room = {roles:[roles[0]], clients:[socket]}
        publicGames.push(room)
        message.payload.role = roles[0]
    } else {
        if(room.roles.length === 1) {
            // room.push(roles[1])
            publicGames[lastIndex].roles.push(roles[1])
            publicGames[lastIndex].clients.push(socket)
            message.payload.role = roles[1]
            message.payload.start = true
        } else {
            let room = {roles:[roles[0]], clients:[socket]}
            publicGames.push(room)
            message.payload.role = roles[0]
        }
        console.log(publicGames)
    }
    socket.send(JSON.stringify(message))
}

function broadcast(message, socketToOmit) {
    wsServer.clients.forEach(connectedClient => {
        if(connectedClient.readyState === WebSocket.OPEN && connectedClient !== socketToOmit){
            connectedClient.send(JSON.stringify(message))
        }
    });
}

function broadcastGame(message, socketToOmit, restart = false) {
    let room = publicGames.find((room) => room.clients.includes(socketToOmit))
    room.clients.forEach((connectedClient) => {
        if(restart) {
            connectedClient.send(JSON.stringify(message))
        } else {
            if(connectedClient.readyState === WebSocket.OPEN && connectedClient !== socketToOmit) {
                connectedClient.send(JSON.stringify(message))
            }
        }
    })
}
