const express = require("express")
const {WebSocketServer} = require("ws")
const http = require("http")
const {PORT} = require("./src/utils/constants")

const server = http.createServer()
const wsServer = new WebSocketServer({server})

server.listen(PORT ,() => {
    console.log("Websocket is running on port", PORT)
})

wsServer.on("connection", (socket) => {
    console.log("Client has connected")
    socket.send("hello from the the server side")
    socket.on("message", (data) => {
        const {type, payload} = JSON.parse(data)
        const message = {payload: {message: "hello from the server side"}}
        console.log(payload.message)
    })
})
