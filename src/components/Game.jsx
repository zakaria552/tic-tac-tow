import { useEffect } from "react"
import { checkGameState} from "../utils/gamelogic"
import "../styles.css"
import { CLIENT, STATE } from "../utils/constants"
function Game(props) {
    const {state, dispatch} = props  
    const playYourTurn = (e) => {
        console.log("my role ", state.playerRole)
        console.dir(e.target.children[0].innerHTML)
        const [i, j] = e.target.id.split("")
        const message = {type: CLIENT.MESSAGES.TURN_PLAYED, payload: {move: [i,j, state.playerRole]}}
        let mutatedGrid = [...state.grid]
        if(state.playerRole && e.target.children[0].innerHTML === "") {
            mutatedGrid[i][j] = state.playerRole
            const gameState = checkGameState(mutatedGrid)
            message.payload.gameState = gameState
            if(gameState.draw) {
                dispatch({type: STATE.ACTION.GAME_DRAW, payload:{grid: mutatedGrid}})
            } else if(gameState.won) {
                dispatch({type: STATE.ACTION.GAME_WON, payload:{grid: mutatedGrid}})
            } else {
                dispatch({type: STATE.ACTION.TURN_PLAYED, payload:{grid: mutatedGrid}})
            }
            console.log("gamestate", gameState)
            state.wsClient.send(JSON.stringify(message))
        }
        if(state.playerTurn && e.target.children[0].innerHTML === "") {
            let nextPlayer = state.playerTurn.player === "player1" ? "player2": "player1"
            mutatedGrid[i][j] = state.playerTurn.role
            const gameState = checkGameState(mutatedGrid)
            console.log("gamestate", gameState)
            if(gameState.draw || gameState.won) {
                if(gameState.draw) {
                    dispatch({type: STATE.ACTION.GAME_DRAW, payload:{grid: mutatedGrid}})
                } else {
                    dispatch({type: STATE.ACTION.GAME_OVER, playerWon: state.playerTurn.player})
                }
            } else {
                dispatch({type: STATE.ACTION.PLAYER_TURN_PLAYED, turn: {player:nextPlayer, role:state[nextPlayer]}})
            }
            
        }

    }
    
    useEffect(() => {
        console.log("start: " + state.startGame, " myturn: " + state.myTurn )
        console.log(props)
    }, [state.grid])
    return (
        <div className="flex flex-col h-3/6 w-11/12 md:w-9/12 md:h-3/5 lg:w-4/5 xl:w-7/12 xl:h-4/6">
            {state.grid.map((row, i) => {
                return (
                    <div key={i} className={`flex justify-center items-center h-1/3 color-border ${i === 0 || i === 1 ? "border-b-4": ""} rounded-md`}>
                        {row.map((tile,j) => {
                            return (
                                <button key={`col${j}`} disabled={!(state.myTurn && state.startGame)} className={`text1 bg-game text-center w-full h-full color-border ${j === 0 || j === 1 ? "border-r-2": ""} rounded-lg`} onClick={playYourTurn} id={`${i}${j}`}>
                                    <h1 className="mb-5 h1 md:text-9xl">{tile}</h1>
                                </button>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Game