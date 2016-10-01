import React from 'react';

class Footer extends React.Component {

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
    let hintClassName = `hint ${this.props.gameState}`;

    return (
      <div className="footer">
        <div className="word-box">
          guess the word: <em className="word">{this.props.word}</em>
        </div>
        <div className={hintClassName}>
          {this.props.hints[this.props.gameState]}
        </div>
        {this.playAgain()}
      </div>
    );
  }
}

Footer.defaultProps = {
  hints: {
    ready: 'Get Ready',
    recall: 'Go!',
    won: 'Well Played',
    lost: 'Game Over'
  }
};

export default Footer;

