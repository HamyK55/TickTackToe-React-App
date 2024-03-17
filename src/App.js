import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({OIsNext, squares, onPlay}) {
  const winner = calculateWinner(squares);

  // Change status to present winner or Next player
  let status;
  if (winner){
    status = "Winner: " + winner;
  }
  else{
    status = "Next Player: " + (OIsNext ? "O" : "X");
  }

  function handleClick(i) {
    // dont handle click if there is already an X or O in the square
    if (squares[i] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();

    if (OIsNext) {
      nextSquares[i] = "O";
    } 
    else{
      nextSquares[i] = "X";
    }
    onPlay(nextSquares); // Handles change of turn
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>  
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
}

// Game logic
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const OIsNext = currentMove % 2 === 1;
  const currentSquares = history[currentMove];
  

  function handlePlay(nextSquares) {
    // when time traveling we only want to keep history uptill the current game state, then add new state
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; 
    setHistory(nextHistory);

    setCurrentMove(currentMove+1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // react component maps an element of history with button
  const moves = history.map((square, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });


  return (
    <div className="game">
      <div className="game-board">
        <Board OIsNext={OIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
