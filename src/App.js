import { useEffect, useState, useReducer } from 'react';
import { initialState, gameStateReducer } from './gameStateReducer';
import './App.css';
import "./styles.css"
import Game from './components/Game';
import {PORT, CLIENT, SERVER, STATE} from "./utils/constants"

function App() {
  const [state, dispatch] = useReducer(gameStateReducer, initialState)
  const [hideModel, setHideModel] = useState(true)
  const [input, setInput] = useState("")
  const url = `wss://be-tic-tac-tow2.onrender.com` // server to ws

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
  const cancel = () => {
    console.log("leaving")
    state.wsClient.send(JSON.stringify({type: CLIENT.MESSAGES.LEAVE_GAME}))
    dispatch({type: STATE.ACTION.CANCEL_SEARCH})
  }
  const modelHandle = (e) => {
    dispatch({type: STATE.ACTION.CHANGE_GAME_MODE, mode: e.target.innerHTML})
    setHideModel(!hideModel)
  }
  const submitHandler = (e) => {
    e.preventDefault()
    state.wsClient.send(JSON.stringify({type: CLIENT.MESSAGES.START_CUSTOM_GAME, payload:{pin:input}}))
    setInput("")
    console.log(input)
  }
  const optionHandler = (e) => {
    if(state.playerRole && !state.gameStart) cancel()
    setHideModel(!hideModel)
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
          case SERVER.BROADCAST.CLOSING_ROOM:
            dispatch({type: STATE.ACTION.CANCEL_SEARCH})
            break;
          default:
            break;
        }
      }
    }
  }, [state.wsClient, state.playerRole, state.grid])
  return (
    <div className="App flex flex-col items-center bg-app bg-cover h-screen overflow-hidden">
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
        <div className={`h1 self-start ml-2 text-lg ${state.playerRole && !state.gameOver ? "": "opacity-0"}`}>role:  {state.playerRole}</div>
      </div>
      <Game state={state} dispatch={dispatch}/>

      <div className=' flex justify-center w-full mt-5'>
        {!state.startGame && !state.playerRole && state.gameMode === "custom game" ? 
        <form className='flex flex-col justify-center items-center' onSubmit={submitHandler}>
          <input className="color-input text-center h1 text-sm p-1 rounded-md mb-2 border-2 focus:outline-none" placeholder='game pin' required value={input} onChange={(e) => setInput(e.target.value)}></input>
          <button className='color-btn self-center p-3 rounded-md'>create a game</button>
        </form>:""}

        {state.gameMode === "play offline" ? <button className='color-btn self-center m-5 p-3 rounded-md '>play offline</button> :""}
        
        {!state.startGame && !state.playerRole && state.gameMode === "find a game" ? <button className={'color-btn self-center m-5 p-3 rounded-md '} onClick={findGame}>find a  game</button> : ""}
        {!state.startGame && state.playerRole ? <div className='flex items-center justify-center'>
          <h1 className='h1 mr-5'>{state.gameMode === "custom game" ? "waiting for someone to join...":"finding a game..."}</h1>
          <button className='bg-slate-600' onClick={cancel}>cancel</button>
        </div> : ""}
        {state.startGame ?<div>
          <button className='color-btn m-5 p-3 rounded-md ' onClick={restartGame}>play again</button>
          <button className='color-btn m-5 p-3 rounded-md ' onClick={cancel}>exit game</button>
        </div>
        : ""}
      </div>
      {state.serverStats ?

       <div className='flex flex-col justify-center items-center'>
        <h2 className='h1 text-6xl'>{state.serverStats}</h2>
        <h2 className='h1 text-xl'>concurrent</h2>
        <h1 className=''>players</h1>
        </div>: ""
       }
       <div className={`model flex-col absolute w-4/5 h-3/6 top-44 ${hideModel ? "hidden" : ""} rounded-md `} id="model">
          <div className='flex justify-end w-full h-10'>
            <div className='h1 text-xl self-center mr-3 cursor-pointer' onClick={() => setHideModel(!hideModel)}>X</div>
          </div>
          <h1 className='h1 text-2xl text-center w-full'>options</h1>
          <div className='flex flex-col h-fit justify-center items-center mt-10 rounded-md'>
            <button className='color-options h1 text-lg m-1 p-2 w-3/5 text-center shadow-lg rounded-md' onClick={modelHandle}>find a game</button>
            <button className='color-options h1 text-lg m-1 p-2 w-3/5 text-center shadow-lg rounded-md' onClick={modelHandle}>play offline</button>
            <button className='color-options h1 m-1 p-2 w-3/5 shadow-lg rounded-md text-lg text-center' onClick={modelHandle}>custom game</button>
          </div>
       </div>
       <div className='absolute w-full cursor-pointer' ><img className="w-9" onClick={optionHandler} src="/filter.png"></img></div>
    </div>
  );
}

export default App;
