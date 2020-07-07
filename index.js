import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from "firebase/app";
import "firebase/firestore";
import './index.css';

		const firebaseConfig = {
		  apiKey: "AIzaSyACyup3dh95vsxrzW43KuY5lAiM1LfGFgk",
		  authDomain: "alumnoapppw.firebaseapp.com",
		  databaseURL: "https://alumnoapppw.firebaseio.com",
		  projectId: "alumnoapppw",
		  storageBucket: "alumnoapppw.appspot.com",
		  messagingSenderId: "217881036318",
		  appId: "1:217881036318:web:400a28811a635443a5d00f",
		  measurementId: "G-4WJBTYQ8C8"
		};
	
		 
var db = !firebase.apps.length? firebase.initializeApp(firebaseConfig).firestore(): firebase.app().firestore();





function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
	db.collection('gato').doc('estado').update({squares: this.state.squares});
  }
	componentDidMount(){
		db.collection('gato').doc('estado').onSnapshot(
		(snapshot) => {
			this.setState({       
				squares: snapshot.data().squares,
				xIsNext: !this.state.xIsNext,});
		},
		(err) => {
			console.log('Error getting documents', err);
		}
		);
	}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
	db.collection('gato').doc('estado').update({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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