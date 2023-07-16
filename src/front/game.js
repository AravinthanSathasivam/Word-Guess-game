const gameUrl = 'http://localhost:5000/game';
const verifyUrl = 'http://localhost:5000/game/verify';

let gameData = null;

async function createGame() {
  try {
    const response = await fetch(gameUrl, {
      method: 'POST',
    });

    const data = await response.json();

    if (response.ok) {
      gameData = data;
      displayWord();
    } else {
      console.log(data.error);
    }
  } catch (error) {
    console.log(error);
  }
}

function displayWord() {
  const word = gameData.word;
  const response = gameData.response;

  let wordDisplay = '';
  for (let i = 0; i < word.length; i++) {
    if (response[i] === '1') {
      wordDisplay += word[i];
    } else {
      wordDisplay += '_';
    }
    wordDisplay += ' ';
  }

  document.getElementById('wordDisplay').textContent = wordDisplay.trim();
}

async function verifyGuess() {
  const userWord = document.getElementById('inputWord').value.trim();

  if (userWord === '') {
    alert('Please enter a guess.');
    return;
  }

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word: userWord }),
    });

    const data = await response.json();

    if (response.ok) {
      gameData = data.game;
      displayWord();
      displayResult(data.response);
    } else {
      console.log(data.error);
    }
  } catch (error) {
    console.log(error);
  }
}

function displayResult(response) {
  const resultElement = document.getElementById('result');
  if (response === '1111111') {
    resultElement.textContent = 'Congratulations! You guessed the word correctly!';
  } else {
    resultElement.textContent = 'Keep guessing!';
  }
}

createGame();
