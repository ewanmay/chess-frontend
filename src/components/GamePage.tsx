import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { AppContext } from '../context/context';
import { useMediaQuery } from "react-responsive";
import { Color, PieceType } from '../context/types';
import Board from './Board';
import allPieces, { PieceImages } from './piece-images';
import WinModal from './WinModal';
import Log from './Log';

function GamePage() {

  const isMobileDeviceOrTablet = useMediaQuery({ maxWidth: 800 })
  const [state, dispatch] = useContext(AppContext)

  const handleReset = () => {
    state.socket.emit("reset", state.game.boardLength)
  }

  const joinTeam = (color: Color) => {
    state.socket.emit("choose-team", color)
    dispatch({ type: "SELECT_TEAM", payload: color })
  }

  const handleQuit = () => {
    state.socket.emit("quit-game")
  }

  const handleBoardSizeChange = (size: number) => {
    dispatch({ type: 'SET_BOARD_SIZE', payload: size })
    state.socket.emit('reset', size);
  }

  const handleStart = () => {
    dispatch({ type: 'SET_VANGUARD_MODE', payload: true })
    state.socket.emit('start-game')
  }

  const getQueenMoveCounter = (color: Color) => {
    const queen = state.game.board.tiles.find(row => row.find(tile => tile.piece.color === color && tile.piece.type === PieceType.Queen))
    if (queen) {
      const x = queen.map(tile => tile.piece.queenCantPlayCounter);
      return Math.min(...x)
    }
    return 0
  }

  const boardSizes = [8, 10, 12, 14, 16];

  const getPieceImage = (pieceType: PieceType, color: Color) => {
    let objectString = "";
    objectString += color
    objectString += pieceType.charAt(0).toUpperCase() + pieceType.slice(1)
    return allPieces[objectString as keyof PieceImages] as any
  }

  return (
    <div className="col-12 p-0 flex">
      <WinModal winner={state.game.winner} />
      {!isMobileDeviceOrTablet && <div className="col-1 sider"></div>}
      <div className="col-sm-6 col-md-2 mt-4 top flex">
        <div className="col-12 p-0 flex left header">
          <img className="icon" src={allPieces.BlackKing} alt="king"></img>
          <h4 className="px-1">Black</h4> <div>{state.playerTeam === Color.Black ? "(You)" : ""}</div>
          <div className="col-12 p-0">Vanguards placed: {state.game.board.blackVanguards}</div>
          {state.game.inCheck === Color.Black && <h6 className="col-12 p-0">{state.game.inCheck} is in check!</h6>}
          {getQueenMoveCounter(Color.Black) > 0 &&
            <div className="col-12 p-0">
              Queen can move in {getQueenMoveCounter(Color.Black)} turns
            </div>
          }
          {state.playerTeam === Color.Null && (<button className="btn btn-primary m-1" onClick={() => joinTeam(Color.Black)}>Join as Black</button>)}
        </div>
        <div className="col-12 p-0 flex pieces left top">
          <h6 className="col-12 p-0 flex">Taken</h6>
          {state.game.takenPieces
            .filter(o => o.color === Color.White).map(o => (
              <div>
                <img className="icon p-1" src={getPieceImage(o.type, o.color)} alt="king"></img></div>)
            )}
        </div>

        <div className="col-12 p-0 flex bottom">
          <Log log={state.log.blackMoves}></Log>
        </div>
      </div>
      {isMobileDeviceOrTablet && (<div className="col-sm-6 col-md-2 mt-4 top flex">
        <div className="col-12 p-0 flex right header">
          <h4 className="px-1">White</h4> <div>{state.playerTeam === Color.White ? "(You)" : ""}</div>
          <img className="icon" src={allPieces.WhiteKing} alt="king"></img>
          <div className="col-12 p-0 flex right">Vanguards placed: {state.game.board.whiteVanguards}</div>
          {state.playerTeam === Color.Null && (<button className="btn btn-primary m-1" onClick={() => joinTeam(Color.White)}>Join as White</button>)}
          {state.game.inCheck === Color.White && <h6 className="col-12 p-0">{state.game.inCheck} is in check!</h6>}
        </div>
        <div className="col-12 p-0 flex pieces top">
          <h6 className="col-12 p-0 right">Taken</h6>
          {state.game.takenPieces
            .filter(o => o.color === Color.Black).map(o => (
              <div>
                <img className="icon p-1" src={getPieceImage(o.type, o.color)} alt="king"></img></div>)
            )}
        </div>
        <Log log={state.log.whiteMoves}></Log>
      </div>)}

      <div className="col-sm-12 col-md-6 p-1 flex center">
        {state.placingVanguards && <h4 className="col-12">{`Place all vanguards by right clicking your pawns to begin.`}</h4>}
        {!state.placingVanguards && state.game.playersTurn !== Color.Null && <h4 className="col-12">{`${state.game.playersTurn}'s move`}</h4>}
        <Board />

        {state.game.started ? (<div className="col-12">
          {state.playerTeam !== Color.Null && <button className="btn btn-secondary m-1" onClick={() => handleReset()}>Reset Board</button>}
          {state.playerTeam !== Color.Null && <button className="btn btn-secondary m-1" onClick={() => joinTeam(Color.Null)}>Reset Team</button>}
          {state.playerTeam !== Color.Null && <button className="btn btn-secondary" onClick={() => handleQuit()}>Change board</button>}
          <div className="col-12 p-0">Total allowed vanguards: {state.game.board.vanguards}</div>
        </div>) :
          (<div className="col-12 p-0 flex center">
            {state.playerTeam !== Color.Null && (
              <div className="col-12 p-0 flex center">
                Board Size:
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {state.game.boardLength}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {boardSizes.map(size => (
                      <Dropdown.Item onClick={() => handleBoardSizeChange(size)}>{size}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <button className="btn btn-success m-1" onClick={() => handleStart()}>Start game</button>
              </div>
            )}
            <div className="col-12 p-0">Total allowed vanguards: {state.game.board.vanguards}</div>
          </div>)}
      </div>

      {!isMobileDeviceOrTablet && (<div className="col-sm-6 col-md-2 mt-4 top flex">
        <div className="col-12 p-0 flex right header">
          <div>{state.playerTeam === Color.White ? "(You)" : ""}</div>
          <h4 className="px-1">White</h4>
          <img className="icon" src={allPieces.WhiteKing} alt="king"></img>
          <div className="col-12 p-0 flex right">Vanguards placed: {state.game.board.whiteVanguards}</div>
          {state.game.inCheck === Color.White && <h6 className="col-12 p-0 right flex">{state.game.inCheck} is in check!</h6>}
          {getQueenMoveCounter(Color.White) > 0 ?
            <div className="col-12 p-0 flex right">
              Queen can move in {getQueenMoveCounter(Color.White)} turns
            </div> :
            <div className="col-12 p-0 flex right">
              Queen can move
            </div>}
          {state.playerTeam === Color.Null && (<button className="btn btn-primary m-1" onClick={() => joinTeam(Color.White)}>Join as White</button>)}
        </div>
        <div className="col-12 p-0 flex pieces top">
          <h6 className="col-12 p-0 right">Taken</h6>
          {state.game.takenPieces
            .filter(o => o.color === Color.Black).map(o => (
              <div>
                <img className="icon p-1" src={getPieceImage(o.type, o.color)} alt="king"></img></div>)
            )}
        </div>
        <Log log={state.log.whiteMoves}></Log>
      </div>)}
      {!isMobileDeviceOrTablet && <div className="col-1 sider"></div>}
    </div >
  );
}

export default GamePage;
