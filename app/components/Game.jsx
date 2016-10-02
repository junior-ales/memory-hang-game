import React from 'react';
import { groupBy, uniq, shuffle, assign, toArray, difference, take, drop, zipObject, range, flatten, sampleSize, sample } from 'lodash';

import Cell from './Cell';
import Row from './Row';
import Footer from './Footer';

const ALPHABET = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

const WORDS = groupBy(uniq(['as', 'raizes', 'etimologicas', 'do', 'termo', 'brasil', 'sao', 'de', 'dificil', 'reconstrucao', 'o', 'filologo', 'adelino', 'jose', 'da', 'silva', 'azevedo', 'postulou', 'que', 'se', 'trata', 'de', 'uma', 'palavra', 'de', 'procedencia', 'celta', 'uma', 'lenda', 'que', 'fala', 'de', 'uma', 'terra', 'de', 'delicias', 'vista', 'entre', 'nuvens', 'mas', 'advertiu', 'tambem', 'que', 'as', 'origens', 'mais', 'remotas', 'do', 'termo', 'poderiam', 'ser', 'encontradas', 'na', 'lingua', 'dos', 'antigos', 'fenicios', 'na', 'epoca', 'colonial', 'cronistas', 'da', 'importancia', 'de', 'joao', 'de', 'barros', 'frei', 'vicente', 'do', 'salvador', 'e', 'pero', 'de', 'magalhaes', 'gandavo', 'apresentaram', 'explicacoes', 'concordantes', 'acerca', 'da', 'origem', 'do', 'nome', 'brasil', 'de', 'acordo', 'com', 'eles', 'o', 'nome', 'brasil', 'e', 'derivado', 'de', 'pau', 'brasil', 'designacao', 'dada', 'a', 'um', 'tipo', 'de', 'madeira', 'empregada', 'na', 'tinturaria', 'de', 'tecidos', 'na', 'epoca', 'dos', 'descobrimentos', 'era', 'comum', 'aos', 'exploradores', 'guardar', 'cuidadosamente', 'o', 'segredo', 'de', 'tudo', 'quanto', 'achavam', 'ou', 'conquistavam', 'a', 'fim', 'de', 'explora', 'lo', 'vantajosamente', 'mas', 'nao', 'tardou', 'em', 'se', 'espalhar', 'na', 'europa', 'que', 'haviam', 'descoberto', 'certa', 'ilha', 'brasil', 'no', 'meio', 'do', 'oceano', 'atlantico', 'de', 'onde', 'extraiam', 'o', 'pau', 'brasil', 'madeira', 'cor', 'de', 'brasa', 'antes', 'de', 'ficar', 'com', 'a', 'designacao', 'atual', 'brasil', 'as', 'novas', 'terras', 'descobertas', 'foram', 'designadas', 'de', 'monte', 'pascoal', 'quando', 'os', 'portugueses', 'avistaram', 'terras', 'pela', 'primeira', 'vez', 'ilha', 'de', 'vera', 'cruz', 'terra', 'de', 'santa', 'cruz', 'nova', 'lusitania', 'cabralia', 'imperio', 'do', 'brasil', 'e', 'estados', 'unidos', 'do', 'brasil', 'os', 'habitantes', 'naturais', 'do', 'brasil', 'sao', 'denominados', 'brasileiros', 'cujo', 'gentilico', 'e', 'registrado', 'em', 'portugues', 'a', 'partir', 'de', '', 'que', 'se', 'referia', 'inicialmente', 'apenas', 'aos', 'que', 'comercializavam', 'pau', 'brasil']), 'length');

class Game extends React.Component {
  constructor(props) {
    super(props);

    const { rows, columns } = props.gameLevel;

    this.matrix = range(rows).map(rowId => {
      return range(columns).map(colId => `${rowId}${colId}`);
    });

    this.word = sample(WORDS[this.props.gameLevel.wordSize]);
    const letterCells = sampleSize(flatten(this.matrix), this.props.gameLevel.wordSize + this.props.gameLevel.wrongLettersQuantity);
    const wrongLetterCells = drop(letterCells, this.props.gameLevel.wordSize);
    this.correctLetterCells = take(letterCells, this.props.gameLevel.wordSize);

    const wrongLetters = take(difference(shuffle(ALPHABET), toArray(this.word)), this.props.gameLevel.wrongLettersQuantity);

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
