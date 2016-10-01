import React from 'react';

class ScoreBoard extends React.Component {
  render() {
    return <div className="score-board">Points: {this.props.score}</div>;
  }
}

export default ScoreBoard;
