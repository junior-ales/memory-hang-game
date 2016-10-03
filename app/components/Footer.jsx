import React from 'react';
import { replace, sample } from 'lodash';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.word = replace(this.props.word, sample(this.props.word), '_')
  }

  playAgain() {
    let playAgainEl = (
      <div>
        <button onClick={this.props.playAgain.bind(this, this.props.gameState)}>
          Play Again
        </button>
        <p>{this.props.word}</p>
      </div>
    );

    if (['won', 'lost'].indexOf(this.props.gameState) > -1) { return playAgainEl; }
  }

  render() {
    const hintClassName = `hint ${this.props.gameState}`;

    return (
      <div className="footer">
        <div className="word-box">
          guess the word: <em className="word">{this.word}</em>
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

