const express = require('express');
const WordModel = require('../models/word');
const GameModel = require('../models/game');
const TryModel = require('../models/try');

const Router = express.Router();

const isLogged = (request, response, next) => {
  if (request.session.user) {
    console.log('test');
    next();
  } else {
    return response.status(500).json({ msg: 'not logged !' });
  }
};

// Create a new game
Router.post('/', async (request, response) => {
  try {
    const word = await WordModel.aggregate([{ $sample: { size: 1 } }]);

    let game = new GameModel({
      word: word[0]._id,
      tries: [],
      user: request.session.user._id,
    });

    await game.save();

    // Set the game ID in the session
    request.session.gameId = game._id;

    game = await GameModel.findOne({ _id: game._id })
      .populate('user')
      .populate('word');

    return response.status(200).json({
      word: game.word.name,
      response: '',
      game: game,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
});

// Get a game by ID
Router.get('/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const game = await GameModel.findOne({ _id: id });

    if (!game) {
      return response.status(404).json({
        error: 'Game not found.',
      });
    }

    return response.status(200).json({
      msg: game,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
});

// Verify a user's word guess
Router.post('/verify', isLogged, async (request, response) => {
  try {
    const { word: userWord } = request.body;

    if (!userWord) {
      return response.status(400).json({
        error: "You must provide a 'word' value in the request body.",
      });
    }

    const gameId = request.session.gameId;

    const game = await GameModel.findById(gameId)
      .populate('word')
      .populate('user');

    if (!game) {
      return response.status(404).json({
        error: 'Game not found.',
      });
    }

    const search = game.word.name;

    let result = '';

    for (let i = 0; i < search.length; i++) {
      if (search[i] === userWord[i]) {
        result += '1';
      } else if (search.includes(userWord[i])) {
        result += '0';
      } else {
        result += 'x';
      }
    }

    const tryModel = new TryModel({
      word: userWord,
      result,
    });

    await tryModel.save();

    game.tries.push(tryModel._id);
    await game.save();

    return response.status(200).json({
      word: userWord,
      response: result,
      game: game,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
});

module.exports = Router;
