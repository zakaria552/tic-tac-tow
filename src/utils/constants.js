const PORT = 3034

const CLIENT = {
    MESSAGES: {
        NEW_USER: "NEW_USER",
        TURN_PLAYED: "TURN_PLAYED",
        START_GAME: "START_GAME",
        FIND_GAME: "FIND_GAME"
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
        STARTING_GAME: "STARTING_GAME"
    }
}

module.exports = {
    PORT,
    CLIENT,
    SERVER
}