import React from 'react';

class Cell extends React.Component {
  handleClick() {
    let isRecallState = this.props.gameState === 'recall';
    let isNotGuessedYet = this.guessState() === undefined;

    if (isRecallState && isNotGuessedYet) {
      this.props.recordGuess({
        cellId: this.props.id,
        userGuessIsCorrect: this.active()
      });
    }
  }

  active() {
    //console.log('active');
    return this.props.activeCells.indexOf(this.props.id) > -1;
  }

  guessState() {
    //console.log('guessState');
    let isCorrectGuess = this.props.correctGuesses.indexOf(this.props.id) > -1;
    let isWrongGuess = this.props.wrongGuesses.indexOf(this.props.id) > -1;

    if (isCorrectGuess) return true;
    if (isWrongGuess) return false;
  }

  render() {
    let className = 'cell';
    if (this.props.showActiveCells && this.active()) {
      className += ' active';
    }

    className += ' guess-' + this.guessState();

    return (
      <div className={className} onClick={this.handleClick.bind(this)}>
      </div>
    );
  }
}

export default Cell;
