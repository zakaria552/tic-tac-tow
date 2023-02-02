import { useState } from "react"
import { winCheck} from "../utils/gamelogic"
import "../styles.css"
function Game(props) {
    const {playerRole} = props
    const grid = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]
    const [turn, setTurn] = useState(playerRole)
    const [gameGrid, setGameGrid] = useState(grid)
  
    const playTurn = (e) => {
        console.dir(e.target.id)
        const [i, j] = e.target.id.split("")
        let mutatedGrid = [...gameGrid]
        console.log(mutatedGrid,"<----")
        if(turn === playerRole) {
            // e.target.innerText = playerRole
            mutatedGrid[i][j] = playerRole 
            setGameGrid(mutatedGrid)
            console.log(winCheck(mutatedGrid))
            setTurn("o")
        } else {
            // e.target.innerText = "o"
            mutatedGrid[i][j] = "o" 
            setGameGrid(mutatedGrid)
            console.log(winCheck(mutatedGrid))
            setTurn("x")
        }
    }

    return (
        <div className="border-2 border-gray-800 flex flex-col h-2/3 w-1/3">
            {gameGrid.map((row, i) => {
                return (
                    <div key={`row${i}`} className="flex justify-center items-center h-1/3">
                        {row.map((tile,j) => {
                            return (
                                <div key={`rowcol${j}`} className=" text1 text-center flex flex-col items-center w-full h-full bg-cyan-300 border-2 cursor-pointer" onClick={playTurn} id={`${i}${j}`}>
                                    {tile}
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Game