import { MouseEventHandler, useState } from "react";

type SquareProps = { value: string | null, onSquareClick: MouseEventHandler }
function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

type BoardProps = { xIsNext: boolean, squares: (string | null)[], onPlay: (nextSquares: (string | null)[]) => void };
function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const pieces = [...Array(3)].map((_, i) => {
    return (
      <div className="board-row">
        {[...Array(3)].map((_, j) => (
          <Square
            value={squares[i * 3 + j]}
            onSquareClick={() => {
              handleClick(i * 3 + j);
            }}
          />
        ))}
      </div>
    );
  });

  return (
    <>
      <div className="status">{status}</div>
      <>{pieces}</>
    </>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
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
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_squares: (string | null)[], move: number) => {
    let description;
    if (move === history.length - 1) {
      description = "You are at move #" + (move + 1);
    } else if (move > 0) {
      description = "Go to move #" + (move + 1);
    } else {
      description = "Go to game start";
    }
    return move < history.length - 1 ? (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    ) : (
      <li key={move}>
        <p>{description}</p>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
