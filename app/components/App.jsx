import React from 'react';
import { mapValues, identity, add } from 'lodash/fp';

import Game from './Game';
import ScoreBoard from './ScoreBoard';

const inc = add(1);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataReady: false,
      wordsMap: {},
      alphabet: [],
      gameId: 1,
      totalScore: 0,
      gameLevel: {
        rows: 6,
        columns: 6,
        wordSize: 4,
        wrongLettersQuantity: 12
      }
    };
  }

  componentWillMount() {
    fetch('dictionary.json')
      .then(res => res.json())
      .then(data => {
        this.setState({
          dataReady: true,
          wordsMap: data.wordsMap,
          alphabet: data.alphabet
        });
      }).catch(err => {
        console.log(`error fetching data: ${err}`)
      });
  }

  playAgain(lastGameStatus) {
    let gameLevel = this.state.gameLevel;

    if (lastGameStatus === 'won') {
      gameLevel.wordSize = inc(gameLevel.wordSize);
      gameLevel.wrongLettersQuantity = inc(gameLevel.wrongLettersQuantity);
    }

    this.setState({ gameId: inc(this.state.gameId), gameLevel });
  }

  updateScore(points) {
    this.setState({ totalScore: this.state.totalScore + points });
  }

  render() {
    return (
      <div id="content">
        {(this.state.dataReady) ? (
          <section>
            <ScoreBoard score={this.state.totalScore} />
            <Game key={this.state.gameId}
                  gameLevel={this.state.gameLevel}
                  wordsMap={this.state.wordsMap}
                  alphabet={this.state.alphabet}
                  updateScore={this.updateScore.bind(this)}
                  playAgain={this.playAgain.bind(this)} />
          </section>
        ) : <p>Initializing Game...</p>}
      </div>
    );
  }
}

export default App;
