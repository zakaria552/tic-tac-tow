import {STATE} from "./utils/constants"
export const initialState = {
    startGame: false,
    myTurn: false,
    playerRole: "",
    grid: [["", "", ""], ["", "", ""],["", "", ""]],
    wsClient: "",
    message: "",
    serverStats: ""
}

export const gameStateReducer = (gameState, action) => {
    const newState = {...gameState}
    newState.grid = [...gameState.grid]
    switch(action.type) {
        case STATE.ACTION.TURN_PLAYED:
            newState.myTurn = false
            newState.grid = action.payload.grid
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
            newState.myTurn = gameState.playerRole === action.payload.playerTurn
            newState.startGame = true
            return newState
        case  STATE.ACTION.CONNECT:
            newState.wsClient = action.payload.wsClient
            return newState
        case STATE.ACTION.SERVER_STATS:
            newState.serverStats = action.payload.clients
            return newState
        default:
            return gameState
    }
}