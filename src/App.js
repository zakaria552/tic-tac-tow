import { useEffect, useState } from 'react';
import './App.css';
import Game from './components/Game';
import {PORT, CLIENT, SERVER} from "./utils/constants"

function App() {
  const [playerRole, setPlayerRole] = useState("") // two roles x or o
  const [startGame, setStartGame] = useState(false)
  const [myTurn, setMyTurn] = useState(false)
  const [grid, setGrid] = useState([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
])
  const url = `ws://localhost:${PORT}`
  const [wsClient, setWsClient] = useState("");
  const [message, setMessge] = useState("")
  const [serverStats, setServerStats] = useState("")
  const findGame = () => {
    wsClient.send(JSON.stringify({type: CLIENT.MESSAGES.FIND_GAME, payload: {message: "find a game"}}))
  }
  const asignArole = (payload) => {
    console.log("setting ", payload.role)
    setPlayerRole(payload.role)
    setMessge("Asigned you the role: " + payload.role)
  }
  const gameStart = (payload) => {
    console.log("Starting game")
    console.log("playerTurn: " + payload.playerTurn, "playerRole: "    + playerRole)
    if(payload.playerTurn === playerRole) setMyTurn(true)
    setStartGame(true)
  }
  const handleTurn = (payload) => {
    let gridAfterMove = grid
    gridAfterMove[payload.move[0]][payload.move[1]] = payload.move[2]
    setGrid(gridAfterMove)
    setMessge("move played: " + payload.move[0] + payload.move[1])
    setMyTurn(true)
  }
  useEffect(() => {
    console.log("useEffect", grid )
    console.log(playerRole)
    
    if(playerRole === "x") wsClient.send(JSON.stringify({type: CLIENT.MESSAGES.START_GAME, payload: {message: "start the game"}}))
    if(!wsClient) {
      let wsClient = new WebSocket(url)
      setWsClient(wsClient)
      console.log("first")
    }
    if(wsClient) {
      console.log("seccond")
      wsClient.onopen = () => {
        const messages = {type: CLIENT.MESSAGES.NEW_USER, payload: {message: "hello from react"}}
        console.log("connection established")
        wsClient.send(JSON.stringify(messages))
      }
      wsClient.onmessage = (messageEvent) => {
        const {type, payload} = JSON.parse(messageEvent.data)
        switch(type) {
          case SERVER.MESSAGES.ROLE_ASIGNMENT:
            asignArole(payload)
            break;
          case SERVER.MESSAGES.SERVER_INFO:
            console.log(payload)
            setServerStats(payload.clientsInServer)
            break;
          case SERVER.BROADCAST.STARTING_GAME:
            gameStart(payload)
            break;
          case SERVER.BROADCAST.TURN_BEEN_PLAYED:
            handleTurn(payload)
            break;
          default:
            break;
        }
      }
    }
  }, [wsClient, playerRole])
  return (
    <div className="App flex flex-col items-center justify-center bg-emerald-200 h-screen">
      <h2 className='text-3xl'>hello</h2>
      {serverStats ? <h2 className=''>Players online: {serverStats}</h2>: ""}
      <Game startGame={startGame} myTurn={myTurn} setMyTurn={setMyTurn} playerRole={playerRole} wsClient={wsClient} grid={grid} setGrid={setGrid}/>
      <div>
        <button className='bg-green-600 m-5 p-3 rounded-md hover:bg-green-400' onClick={findGame}>Join a  game</button>
        <button className='bg-green-600 m-5 p-3 rounded-md hover:bg-green-400' onClick={""}>reset</button>
      </div>
      {message ? <h1 className='text-2xl'>{message}</h1>: ""}
    </div>
  );
}

export default App;
