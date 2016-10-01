import React from 'react';
import { range, flatten, sampleSize } from 'lodash';

import Cell from './Cell';
import Row from './Row';
import Footer from './Footer';

class Game extends React.Component {
  constructor(props) {
    super(props);

    const { rows, columns, activeCellsCount } = props.gameLevel;

    this.matrix = range(rows).map(rowId => {
      return range(columns).map(colId => `${rowId}${colId}`);
    });

    this.activeCells = sampleSize(flatten(this.matrix), activeCellsCount);

    this.state = {
      gameState: 'ready',
      correctGuesses: [],
      wrongGuesses: []
    };
  }

  componentDidMount() {
    this.memorizeTimerId = setTimeout(() => {
      this.setState({ gameState: 'memorize' }, () => {
        this.recallTimerId = setTimeout(this.startRecallMode.bind(this), 2000);
      });
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.memorizeTimerId);
    clearTimeout(this.recallTimerId);
    this.finishGame();
  }

  startRecallMode() {
    this.setState({ gameState: 'recall' }, () => {
      this.secondsRemaining = this.props.timeoutSeconds;

      this.playTimerId = setInterval(() => {
        if (--this.secondsRemaining === 0) {
          this.setState({ gameState: this.finishGame('lost') });
        }
      }, 1000);
    });
  }

  finishGame(gameState) {
    clearInterval(this.playTimerId);
    return gameState;
  }

  calculateScore(wrongGuesses) {
    let score;

    if (wrongGuesses === 0) score = 3;
    else if (wrongGuesses === 1) score = 2;
    else score = 1;

    const bonusTimeout = this.props.timeoutSeconds / 2;
    if (this.secondsRemaining >= bonusTimeout) score *= 2;

    return score;
  }

  recordGuess({cellId, userGuessIsCorrect}) {
    let { correctGuesses, wrongGuesses, gameState } = this.state;

    userGuessIsCorrect ? correctGuesses.push(cellId) : wrongGuesses.push(cellId);

    if (correctGuesses.length === this.props.gameLevel.activeCellsCount) {
      gameState = this.finishGame('won');
      this.props.updateScore(this.calculateScore(wrongGuesses.length));
    }

    if (wrongGuesses.length > this.props.allowedWrongAttempts) {
      gameState = this.finishGame('lost');
    }

    this.setState({ correctGuesses, wrongGuesses, gameState });
  }

  render() {
    let showActiveCells = ['memorize', 'lost'].indexOf(this.state.gameState) > -1;

    return (
      <div className="grid">
        {this.matrix.map((row, ri) => (
          <Row key={ri}>
            {row.map(cellId =>
              <Cell key={cellId} id={cellId}
                    activeCells={this.activeCells}
                    showActiveCells={showActiveCells}
                    recordGuess={this.recordGuess.bind(this)}
                    correctGuesses={this.state.correctGuesses}
                    wrongGuesses={this.state.wrongGuesses}
                    gameState={this.state.gameState} />
            )}
          </Row>
        ))}
        <Footer gameState={this.state.gameState}
                playAgain={this.props.playAgain}
                correctGuesses={this.state.correctGuesses}
                activeCellsCount={this.props.gameLevel.activeCellsCount} />
      </div>
    );
  }
}

Game.defaultProps = {
  allowedWrongAttempts: 2,
  timeoutSeconds: 10
};

export default Game;
