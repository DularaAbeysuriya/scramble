import React, { useState, useEffect } from 'react';
import './App.css';

// Shuffle function to scramble words
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const shuffleWord = (word) => shuffleArray(word.split('')).join('');

// Words array
const wordsList = [
  "apple", "tree", "banana", "cherry", "date", "fig", "boy", "orange",
  "grape", "house", "kiwi", "lemon", "mango", "orange", "cat", "dog", "canada", "australia", "girl"
];

const ScrambleGame = () => {
  const [wordList, setWordList] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(3);
  const maxStrikes = 3;

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('scrambleGameState'));
    if (savedState) {
      setWordList(savedState.wordList);
      setCurrentWord(savedState.currentWord);
      setScrambledWord(savedState.scrambledWord);
      setPoints(savedState.points);
      setStrikes(savedState.strikes);
      setPasses(savedState.passes);
    } else {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    if (currentWord) {
      setScrambledWord(shuffleWord(currentWord));
    }
  }, [currentWord]);

  useEffect(() => {
    const gameState = {
      wordList,
      currentWord,
      scrambledWord,
      points,
      strikes,
      passes
    };
    localStorage.setItem('scrambleGameState', JSON.stringify(gameState));
  }, [wordList, currentWord, scrambledWord, points, strikes, passes]);

  const initializeGame = () => {
    const shuffledWords = shuffleArray(wordsList);
    setWordList(shuffledWords);
    setCurrentWord(shuffledWords[0]);
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setMessage('');
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      setMessage('Correct!');
      loadNextWord();
    } else {
      setStrikes(strikes + 1);
      setMessage('Incorrect. Try again.');
      if (strikes + 1 >= maxStrikes) {
        endGame();
      }
    }
    setGuess('');
  };

  const loadNextWord = () => {
    const remainingWords = wordList.slice(1);
    if (remainingWords.length === 0) {
      endGame();
    } else {
      setWordList(remainingWords);
      setCurrentWord(remainingWords[0]);
    }
  };

  const passWord = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      if (passes - 1 === 0) {
        endGame();
      } else {
        loadNextWord();
      }
    }
  };

  const endGame = () => {
    setMessage(`Game over! Your score: ${points}`);
  };

  const restartGame = () => {
    initializeGame();
  };

  const isGameOver = passes === 0 || strikes >= maxStrikes || wordList.length === 0;

  return (
    <div className="game">
      <h1>Welcome to Scramble.</h1>
      <div className="scoreSection">
        <div className="scoreSectionLeft">
          <h1>{points}</h1>
          <p>Points</p>
        </div>
        <div className="scoreSectionRight">
          <h1>{strikes}</h1>
          <p>Strikes</p>
        </div>
      </div>

      {message && <p className="gameMessage">{message}</p>}

      <h1>{scrambledWord}</h1>

      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          autoFocus
          disabled={isGameOver}
        />
      </form>

      <button className="passes" onClick={passWord} disabled={isGameOver}>
        Pass ({passes} remaining)
      </button>

      {isGameOver && (
        <button onClick={restartGame}>Play Again</button>
      )}
    </div>
  );
}

export default ScrambleGame;
