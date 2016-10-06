import React from 'react';
import {
  groupBy, uniq, shuffle,
  assign, toArray, difference,
  take, drop, zipObject,
  range, flatten, sampleSize, sample
} from 'lodash';

import Cell from './Cell';
import Row from './Row';
import Footer from './Footer';

class Game extends React.Component {
  constructor(props) {
    super(props);

    const {
      wordsMap,
      alphabet,
      gameLevel: {
        rows,
        columns,
        wordSize,
        wrongLettersQuantity
      }
    } = props;

    this.matrix = range(rows).map(rowId => {
      return range(columns).map(colId => `${rowId}${colId}`);
    });

    this.word = sample(wordsMap[wordSize]);
    const letterCells = sampleSize(flatten(this.matrix), wordSize + wrongLettersQuantity);
    const wrongLetterCells = drop(letterCells, wordSize);
    this.correctLetterCells = take(letterCells, wordSize);

    const wrongLetters = take(difference(shuffle(alphabet), toArray(this.word)), wrongLettersQuantity);

    this.lettersMap = assign({}, zipObject(this.correctLetterCells, this.word), zipObject(wrongLetterCells, wrongLetters.join('')));

    this.state = {
      gameState: 'ready',
      correctGuesses: [],
      wrongGuesses: []
    };
  }

  componentDidMount() {
    this.recallTimerId = setTimeout(this.startRecallMode.bind(this), 3000);
  }

  componentWillUnmount() {
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

    if (correctGuesses.length === this.word.length) {
      gameState = this.finishGame('won');
      this.props.updateScore(this.calculateScore(wrongGuesses.length));
    }

    if (wrongGuesses.length > this.props.allowedWrongAttempts) {
      gameState = this.finishGame('lost');
    }

    this.setState({ correctGuesses, wrongGuesses, gameState });
  }

  render() {
    return (
      <div className="grid">
        {this.matrix.map((row, ri) => (
          <Row key={ri}>
            {row.map(cellId =>
              <Cell key={cellId} id={cellId}
                    letter={this.lettersMap[cellId]}
                    correctLetterCells={this.correctLetterCells}
                    showAnswer={this.state.gameState === 'lost'}
                    enabled={this.state.gameState === 'recall'}
                    recordGuess={this.recordGuess.bind(this)}
                    correctGuesses={this.state.correctGuesses}
                    wrongGuesses={this.state.wrongGuesses}
                    gameState={this.state.gameState} />
            )}
          </Row>
        ))}
        <Footer gameState={this.state.gameState}
                word={this.word}
                playAgain={this.props.playAgain}
                correctGuesses={this.state.correctGuesses}
                activeCellsCount={this.word.length} />
      </div>
    );
  }
}

Game.defaultProps = {
  allowedWrongAttempts: 2,
  timeoutSeconds: 10
};

export default Game;
