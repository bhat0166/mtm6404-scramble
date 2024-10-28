/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src];

  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }

  if (typeof src === "string") {
    return copy.join("");
  }

  return copy;
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
import React, { useState, useEffect } from "react";
import './App.css'; // Import your CSS file

const App = () => {
  // Array of words for the game
  const words = ["apple", "banana", "cherry", "grape", "lemon", "melon", "orange", "peach", "berry", "kiwi"];

  // Maximum allowed strikes and passes
  const MAX_STRIKES = 3;
  const MAX_PASSES = 3;

  // State hooks with default values either from local storage or defaults
  const [score, setScore] = useState(Number(localStorage.getItem("score")) || 0);
  const [strikes, setStrikes] = useState(Number(localStorage.getItem("strikes")) || 0);
  const [passes, setPasses] = useState(Number(localStorage.getItem("passes")) || MAX_PASSES);
  const [currentIndex, setCurrentIndex] = useState(Number(localStorage.getItem("currentIndex")) || 0);
  const [scrambledWord, setScrambledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");

  // Scramble the current word based on the index
  useEffect(() => {
    if (words[currentIndex]) {
      setScrambledWord(shuffle(words[currentIndex]));
    }
  }, [currentIndex]);

  // Store game state in local storage
  useEffect(() => {
    localStorage.setItem("score", score);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("passes", passes);
    localStorage.setItem("currentIndex", currentIndex);
  }, [score, strikes, passes, currentIndex]);

  // Handle user input for guesses
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(event.target.value);
};

  // Handle guess submission
  const handleGuess = () => {
    if (guess.toLowerCase() === words[currentIndex].toLowerCase()) {
      setScore(score + 1);
      setMessage("Correct! Moving to the next word.");
      const nextIndex = currentIndex + 1;

      if (nextIndex < words.length) {
        setCurrentIndex(nextIndex);
      } else {
        setMessage("Congratulations! You've completed the game.");
      }
    } else {
      setStrikes(strikes + 1);
      setMessage("Incorrect. Try again.");
      if (strikes + 1 >= MAX_STRIKES) {
        setMessage("Game over! You've reached the maximum number of strikes.");
      }
    }
    setGuess("");
  };

  // Handle pass functionality
  const handlePass = () => {
    if (passes > 0 && currentIndex < words.length - 1) {
      setPasses(passes - 1);
      setCurrentIndex(currentIndex + 1);
      setMessage("Word passed! Moving to the next word.");
    } else if (passes > 0) {
      setMessage("You've reached the end of the word list.");
    } else {
      setMessage("No passes remaining.");
    }
  };

  // Reset the game completely
  const resetGame = () => {
    setScore(0);
    setStrikes(0);
    setPasses(MAX_PASSES);
    setCurrentIndex(0);
    localStorage.clear();
    setGuess("");
    setMessage("Game reset. Ready to start again?");
    setScrambledWord(shuffle(words[0])); // Start with the first word scrambled
  };

  // Enter key trigger for guessing
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleGuess();
    }
  };
  
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Scramble Game</h1>
      <p>Score: {score}</p>
      <p>Strikes: {strikes}/{MAX_STRIKES}</p>
      <p>Passes remaining: {passes}</p>
      {message && <p>{message}</p>}
      {words[currentIndex] && strikes < MAX_STRIKES ? (
        <>
          <p>Scrambled word: {scrambledWord}</p>
          <input
            type="text"
            value={guess}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleGuess}>Guess</button>
          <button onClick={handlePass} disabled={passes === 0}>
            Pass
          </button>
        </>
      ) : (
        <p>Game Over! Final Score: {score}</p>
      )}
      <button onClick={resetGame} style={{ marginTop: "10px" }}>
        Restart Game
      </button>
    </div>
  );
};

export default App;
