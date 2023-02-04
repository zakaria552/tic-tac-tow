import { useEffect, useState } from "react"
import { winCheck} from "../utils/gamelogic"
import "../styles.css"
import { CLIENT, STATE } from "../utils/constants"
function Game(props) {
    const {state, dispatch} = props  
    console.log(props)
    const playYourTurn = (e) => {
        console.log("my role ", state.playerRole)
        const [i, j] = e.target.id.split("")
        const message = {type: CLIENT.MESSAGES.TURN_PLAYED, payload: {move: [i,j, state.playerRole]}}
        let mutatedGrid = [...state.grid]
        if(state.playerRole) {
            mutatedGrid[i][j] = state.playerRole
            dispatch({type: STATE.ACTION.TURN_PLAYED, payload:{grid: mutatedGrid}})
            state.wsClient.send(JSON.stringify(message))
        } 
    }
    useEffect(() => {
        console.log("start: " + state.startGame, " myturn: " + state.myTurn )
        console.log(props)
    }, [state, state.myTurn])
    return (
        <div className="border-2 border-gray-800 flex flex-col h-2/3 w-1/3">
            {state.grid.map((row, i) => {
                {console.log(row)}
                return (
                    <div key={i} className="flex justify-center items-center h-1/3">
                        {row.map((tile,j) => {
                            return (
                                <button key={`col${j}`} disabled={!(state.myTurn && state.startGame)} className=" text1 text-center flex flex-col items-center w-full h-full bg-cyan-300 border-2" onClick={playYourTurn} id={`${i}${j}`}>
                                    {tile}
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