import { useEffect, useState, useReducer } from 'react';
import { initialState, gameStateReducer } from './gameStateReducer';
import './App.css';
import "./styles.css"
import Game from './components/Game';
import {PORT, CLIENT, SERVER, STATE} from "./utils/constants"

function App() {
  const [state, dispatch] = useReducer(gameStateReducer, initialState)
  const url = `ws://localhost:${PORT}` // server to ws

  // helper functions
  const findGame = () => {
    state.wsClient.send(JSON.stringify({type: CLIENT.MESSAGES.FIND_GAME, payload: {message: "find a game"}}))
  }
  const asignArole = (payload) => {
    console.log("setting ", payload.role)
    dispatch({type: STATE.ACTION.ASIGNED_ROLE, payload:{role: payload.role, message: "Asigned you the role: " + payload.role}})
    if(payload.start) state.wsClient.send(JSON.stringify({type: CLIENT.MESSAGES.START_GAME, payload: {message: "start the game"}}))
  }
  const gameStart = (payload) => {
    console.log("Starting game")
    console.log("playerTurn: " + payload.playerTurn, "playerRole: "    + state.playerRole)
    dispatch({type: STATE.ACTION.START_GAME, payload:{playerTurn: payload.playerTurn}})
  }
  const handleTurn = (payload) => {
    let gridAfterMove = [...state.grid]
    gridAfterMove[payload.move[0]][payload.move[1]] = payload.move[2]
    dispatch({type: STATE.ACTION.MY_TURN, payload:{grid: gridAfterMove, message: "move played: " + payload.move[0] + payload.move[1]}})
  }
  const lostHandle = (payload) => {
    let gridAfterMove = state.grid
    gridAfterMove[payload.move[0]][payload.move[1]] = payload.move[2]
    dispatch({type:STATE.ACTION.GAME_LOST, payload:{grid:gridAfterMove}})
  }
  const drawHandle = (payload) => {
    let gridAfterMove = state.grid
    gridAfterMove[payload.move[0]][payload.move[1]] = payload.move[2]
    dispatch({type: STATE.ACTION.GAME_DRAW, payload:{grid:gridAfterMove}})
  }
  const restartGame = () => {
    if(state.gameOver) {
      console.log("restart")
      state.wsClient.send(JSON.stringify({type: CLIENT.MESSAGES.RESTART_GAME}))
    }
  }
  useEffect(() => {
    console.log("useEffect", state.grid )
    // if(state.playerRole === "x" && state.START_GAME === true) state.wsClient.send(JSON.stringify({type: CLIENT.MESSAGES.START_GAME, payload: {message: "start the game"}}))
    if(!state.wsClient) {
      let wsClient = new WebSocket(url)
      dispatch({type: STATE.ACTION.CONNECT, payload:{wsClient}})
      console.log("first")
    }
    if(state.wsClient) {
      console.log("seccond")
      state.wsClient.onopen = () => {
        const messages = {type: CLIENT.MESSAGES.NEW_USER, payload: {message: "hello from react"}}
        console.log("connection established")
        state.wsClient.send(JSON.stringify(messages))
      }
      state.wsClient.onmessage = (messageEvent) => {
        const {type, payload} = JSON.parse(messageEvent.data)
        switch(type) {
          case SERVER.MESSAGES.ROLE_ASIGNMENT:
            asignArole(payload)
            break;
          case SERVER.MESSAGES.SERVER_INFO:
            console.log(payload)
            dispatch({type: STATE.ACTION.SERVER_STATS, payload:{clients: payload.clientsInServer}})
            break;
          case SERVER.BROADCAST.STARTING_GAME:
            gameStart(payload)
            break;
          case SERVER.BROADCAST.TURN_BEEN_PLAYED:
            handleTurn(payload)
            break;
          case SERVER.BROADCAST.GAME_DRAW:
            drawHandle(payload)
            break;
          case SERVER.BROADCAST.GAME_LOST:
            lostHandle(payload)
            break;
          default:
            break;
        }
      }
    }
  }, [state.wsClient, state.playerRole, state.grid])
  return (
    <div className="App flex flex-col items-center bg-app bg-cover h-screen">
        {!state.gameStart ? <h1 className='text-5xl h1 text-slate-700 mt-24 mb-5'>Tic-Tac-Tow</h1>: ""}
        {state.gameStart && !state.gameOver ? (<div className="flex flex-col mt-20" >
          <h1 className='h1 text-2xl'>Player turn</h1>
          <h1 className='h1 text-5xl self-center'>{state.myTurn ? state.playerRole: state.playerRole === "x" ? "o": "x"}</h1>
        </div>) : ""
        }
        {state.gameOver ? <div className='ml-2 h1 text-4xl mt-24 mb-5'>
          {state.gameDraw ? <h1 className='h1 text-4xl'>Game draw</h1>: ""}
          {state.gameLost ? <h1 className='h1 text-4xl'>Game Lost</h1>: ""}
          {state.gameWon ? <h1 className='h1 text-4xl'>Game won</h1>: ""}
        </div>: ""}
      <div className='flex justify-between items-center w-full ml-2'>
        {state.playerRole && !state.gameOver ? <div className='h1 self-start ml-2 text-lg'>role:  {state.playerRole}</div>: ""}
      </div>
      <Game state={state} dispatch={dispatch}/>
      <div>
        {!state.startGame ? <button className={'color-btn m-5 p-3 rounded-md '} onClick={findGame}>find a  game</button> : ""}
        
        {state.startGame ? <button className='color-btn m-5 p-3 rounded-md ' onClick={restartGame}>reset</button>: ""}
      </div>
      {state.serverStats ?
       <div className='flex flex-col justify-center items-center'>
        <h2 className='h1 text-6xl'>{state.serverStats}</h2>
        <h2 className='h1 text-xl'>concurrent</h2>
        <h1 className=''>players</h1>
        </div>: ""
       }
    </div>
  );
}

export default App;
