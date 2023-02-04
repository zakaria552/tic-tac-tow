import { useEffect, useState, useReducer } from 'react';
import { initialState, gameStateReducer } from './gameStateReducer';
import './App.css';
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
  }
  const gameStart = (payload) => {
    console.log("Starting game")
    console.log("playerTurn: " + payload.playerTurn, "playerRole: "    + state.playerRole)
    dispatch({type: STATE.ACTION.START_GAME, payload:{playerTurn: payload.playerTurn}})
  }
  const handleTurn = (payload) => {
    let gridAfterMove = state.grid
    gridAfterMove[payload.move[0]][payload.move[1]] = payload.move[2]
    dispatch({type: STATE.ACTION.MY_TURN, payload:{grid: gridAfterMove, message: "move played: " + payload.move[0] + payload.move[1]}})
  }
  useEffect(() => {
    console.log("useEffect", state.grid )
    if(state.playerRole === "x") state.wsClient.send(JSON.stringify({type: CLIENT.MESSAGES.START_GAME, payload: {message: "start the game"}}))
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
          default:
            break;
        }
      }
    }
  }, [state.wsClient, state.playerRole])
  return (
    <div className="App flex flex-col items-center justify-center bg-emerald-200 h-screen">
      <h2 className='text-3xl'>hello</h2>
      {state.serverStats ? <h2 className=''>Players online: {state.serverStats}</h2>: ""}
      <Game state={state} dispatch={dispatch}/>
      <div>
        <button className='bg-green-600 m-5 p-3 rounded-md hover:bg-green-400' onClick={findGame}>Join a  game</button>
        <button className='bg-green-600 m-5 p-3 rounded-md hover:bg-green-400' onClick={""}>reset</button>
      </div>
      {state.message ? <h1 className='text-2xl'>{state.message}</h1>: ""}
    </div>
  );
}

export default App;
