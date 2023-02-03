import { useEffect, useState } from "react"
import { winCheck} from "../utils/gamelogic"
import "../styles.css"
import { CLIENT } from "../utils/constants"
function Game(props) {
    const {myTurn, setMyTurn, playerRole, grid, setGrid, wsClient, move, startGame} = props  
    const playYourTurn = (e) => {
        console.log("my role ", playerRole)
        let gameState; 
        const [i, j] = e.target.id.split("")
        const message = {type: CLIENT.MESSAGES.TURN_PLAYED, payload: {move: [i,j, playerRole]}}
        let mutatedGrid = [...grid]
        if(playerRole) {
            mutatedGrid[i][j] = playerRole 
            setGrid(mutatedGrid)
            wsClient.send(JSON.stringify(message))
            setMyTurn(false)
        } 
        //else {
        //     // e.target.innerText = "o"
        //     mutatedGrid[i][j] = "o" 
        //     setGameGrid(mutatedGrid)
        //     console.log(winCheck(mutatedGrid))
        //     setTurn("x")
        // }
    }
    useEffect(() => {
        console.log("start: " + startGame, " myturn: " + myTurn )
    }, [startGame, myTurn])
    return (
        <div className="border-2 border-gray-800 flex flex-col h-2/3 w-1/3">
            {grid.map((row, i) => {
                return (
                    <div key={i} className="flex justify-center items-center h-1/3">
                        {row.map((tile,j) => {
                            return (
                                <button key={`col${j}`} disabled={!(myTurn && startGame)} className=" text1 text-center flex flex-col items-center w-full h-full bg-cyan-300 border-2" onClick={playYourTurn} id={`${i}${j}`}>
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