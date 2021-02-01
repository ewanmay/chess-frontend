import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AppContext } from '../context/context';
import { Color } from '../context/types';
import './WinModal.css'
interface WinModalProps {
  winner: Color
}

function WinModal({ winner }: WinModalProps) {
  const [state, dispatch] = useContext(AppContext)

  const [showModal, setShowModal] = useState(true)

  useEffect(() => {
    if (winner === Color.Null) {
      setShowModal(true)
    }
  }, [winner])
  return (
    <>
      { winner !== Color.Null && showModal && (
        <div className="win-modal-background">
          <div className="win-modal flex center">
            <div className="col-12 p-0">
              <h5>{state.playerTeam === winner ? "Congratulations!" : "Better luck next time!"}</h5>
            </div>
            <div className="col-12 p-0">
              {winner + " wins!"}
            </div>
            <div className="col-12 p-0">
              <Button className="close-button" onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
}

export default WinModal;
