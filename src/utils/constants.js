const PORT = 3034

const CLIENT = {
    MESSAGES: {
        NEW_USER: "NEW_USER",
        TURN_PLAYED: "TURN_PLAYED",
        START_GAME: "START_GAME",
        FIND_GAME: "FIND_GAME",
        GAME_WON: "GAME_WON",
        RESTART_GAME: "RESTART_GAME",
    }
}

const SERVER = {
    MESSAGES: {
        SERVER_INFO: "SERVER_INFO",
        ROLE_ASIGNMENT: "ROLE_ASIGNMENT", 
        GAME_IS_FULL: "GAME_IS_FULL",
        READY_TO_BEGIN: "READY_TO_BEGIN"
    },
    BROADCAST: {
        TURN_BEEN_PLAYED: "TURN_BEEN_PLAYED",
        STARTING_GAME: "STARTING_GAME",
        GAME_LOST: "GAME_LOST",
        GAME_WON: "GAME_WON",
        GAME_DRAW: "GAME_DRAW", 
        RESTARTING_GAME: "RESTARTING_GAME"
    }
}

const STATE = {
    ACTION: {
        TURN_PLAYED: "TURN_PLAYED",
        ASIGNED_ROLE: "ASIGNED_ROLE",
        MY_TURN: "MY_TURN",
        START_GAME: "START_GAME",
        CONNECT: "CONNECT", 
        SERVER_STATS:"SERVER_STATS",
        GAME_DRAW: "GAME_DRAW",
        GAME_WON: "GAME_WON",
        GAME_LOST: "GAME_LOST", 
        RESTART_GAME: "RESTART_GAME"
    }
}
module.exports = {
    PORT,
    CLIENT,
    SERVER,
    STATE
}