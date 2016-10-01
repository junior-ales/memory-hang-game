import React from 'react';
import { mapValues, identity, add } from 'lodash/fp';

import Game from './Game';
import ScoreBoard from './ScoreBoard';

const inc = add(1);

const nextLevel = (status, level) => {
  return mapValues(status === 'won' ? inc : identity, level);
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: 1,
      totalScore: 0,
      gameLevel: {
        rows: 5,
        columns: 5,
        activeCellsCount: 6
      }
    };
  }

  playAgain(lastGameStatus) {
    this.setState({
      gameId: inc(this.state.gameId),
      gameLevel: nextLevel(lastGameStatus, this.state.gameLevel)
    });
  }

  updateScore(points) {
    this.setState({ totalScore: this.state.totalScore + points });
  }

  render() {
    return (
      <div id="content">
        <ScoreBoard score={this.state.totalScore} />
        <Game key={this.state.gameId}
              gameLevel={this.state.gameLevel}
              updateScore={this.updateScore.bind(this)}
              playAgain={this.playAgain.bind(this)} />
      </div>
    );
  }
}

export default App;
