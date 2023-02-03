const PORT = 3032

const CLIENT = {
    MESSAGES: {
        NEW_USER: "NEW_USER",
        TURN_PLAYED: "TURN_PLAYED",
        START_GAME: "START_GAME"
    }
}

const SERVER = {
    MESSAGES: {
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