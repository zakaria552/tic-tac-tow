import {STATE} from "./utils/constants"
export const initialState = {
    startGame: false,
    myTurn: false,
    playerRole: "",
    grid: [["", "", ""], ["", "", ""],["", "", ""]],
    wsClient: "",
    message: "",
    serverStats: "",
    gameWon: false,
    gameLost: false,
    gameDraw: false,
    gameOver: false,
    gameMode: "find a game",
    gamePin: "",
    player1: false,
    player2: false,
    playerTurn: "", 
    playerWon: ""
}

export const gameStateReducer = (gameState, action) => {
    let newState = {...gameState}
    newState.grid = [...gameState.grid]
    switch(action.type) {
        case STATE.ACTION.PLAY_OFFLINE:
            newState.player1 = "x"
            newState.player2 = "o"
            newState.startGame = true
            newState.playerTurn = action.turn
            newState.myTurn = true
            return newState
        case STATE.ACTION.TURN_PLAYED:
            newState.myTurn = false
            newState.grid = action.payload.grid
            return newState
        case STATE.ACTION.PLAYER_TURN_PLAYED:
            newState.playerTurn = action.turn
            return newState
        case STATE.ACTION.MY_TURN:
            newState.myTurn = true
            newState.grid = action.payload.grid
            newState.message = action.payload.message
            return newState
        case STATE.ACTION.ASIGNED_ROLE:
            newState.playerRole = action.payload.role
            newState.message = action.payload.message
            return newState
        case STATE.ACTION.START_GAME:
            newState.gameDraw = false
            newState.gameLost = false
            newState.gameWon = false
            newState.gameOver = false
            newState.myTurn = gameState.playerRole === action.payload.playerTurn
            newState.startGame = true
            newState.grid = [["", "", ""], ["", "", ""],["", "", ""]]
            newState.message = ""
            newState.startGame = true
            return newState
        case STATE.ACTION.RESTART_OFFLINE:
            let zeroOrOne = Math.floor(Math.random() * 2)
            let player = ["player1", "player2"][zeroOrOne]
            newState.gameDraw = false
            newState.gameLost = false
            newState.gameWon = false
            newState.gameOver = false
            newState.grid = [["", "", ""], ["", "", ""],["", "", ""]]
            newState.playerTurn = {player, role: player === "player1" ? "x": "o"}
            newState.playerWon = ""
            newState.startGame = true
            newState.myTurn = true
            return newState
        case  STATE.ACTION.CONNECT:
            newState.wsClient = action.payload.wsClient
            return newState
        case STATE.ACTION.SERVER_STATS:
            newState.serverStats = action.payload.clients
            return newState
        case STATE.ACTION.GAME_WON: 
            newState.gameWon = true
            newState.gameOver = true
            return newState
        case STATE.ACTION.GAME_DRAW: 
            console.log(action)
            newState.gameDraw = true
            newState.grid = action.payload.grid
            newState.gameOver = true
            return newState
        case STATE.ACTION.GAME_LOST: 
            newState.gameLost = true
            newState.grid = action.payload.grid
            newState.gameOver = true
            return newState
        case STATE.ACTION.GAME_OVER:
            newState.playerWon = action.playerWon
            newState.gameOver = true
            newState.myTurn = false
            return newState
        case STATE.ACTION.CANCEL_SEARCH:
            newState = initialState
            newState.wsClient = gameState.wsClient
            newState.serverStats = gameState.serverStats
            newState.grid = [["", "", ""], ["", "", ""],["", "", ""]]
            console.log(newState)
            return newState
        case STATE.ACTION.CHANGE_GAME_MODE:
            console.log(action)
            newState.gameMode = action.mode
            return newState
        default:
            return gameState
    }
}