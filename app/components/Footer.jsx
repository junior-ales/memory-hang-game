import React from 'react';

class Footer extends React.Component {
  remainingCount() {
    let remainingCountEl = (
      <div className="remaining-count">
        {this.props.activeCellsCount - this.props.correctGuesses.length}
      </div>
    );

    if (this.props.gameState === 'recall') return remainingCountEl;
  }

  playAgain() {
    let playAgainEl = (
      <div>
        <button onClick={this.props.playAgain.bind(this, this.props.gameState)}>
          Play Again
        </button>
      </div>
    );

    if (['won', 'lost'].indexOf(this.props.gameState) > -1) { return playAgainEl; }
  }

  render() {
    return (
      <div className="footer">
        <div className="hint">
          {this.props.hints[this.props.gameState]}
        </div>
        {this.remainingCount()}
        {this.playAgain()}
      </div>
    );
  }
}

Footer.defaultProps = {
  hints: {
    ready: 'Get Ready',
    memorize: 'Memorize',
    recall: 'Recall',
    won: 'Well Played',
    lost: 'Game Over'
  }
};

export default Footer;

