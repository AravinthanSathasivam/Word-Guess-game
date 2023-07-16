const express = require('express');
const Router = express.Router();

const WordModel = require('../models/word');

// Create a new word
Router.post('/', async (request, response) => {
  try {
    const { word } = request.body;

    if (!word) {
      return response.status(400).json({
        error: "You must provide a 'word' value in the request body.",
      });
    }

    const wordModel = new WordModel({
      name: word,
    });

    await wordModel.save();

    return response.status(200).json({
      msg: word,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
});

// Get all words
Router.get('/', async (request, response) => {
  try {
    const words = await WordModel.find({});

    return response.status(200).json({
      words,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
});

// Get a word by ID
Router.get('/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const word = await WordModel.findById(id);

    if (!word) {
      return response.status(404).json({
        error: 'Word not found.',
      });
    }

    return response.status(200).json({
      word,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
});

// Update a word by ID
Router.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { word } = request.body;

  if (!word) {
    return response.status(400).json({
      error: "You must provide a 'word' value in the request body.",
    });
  }

  try {
    const updatedWord = await WordModel.findByIdAndUpdate(
      id,
      { name: word },
      { new: true }
    );

    if (!updatedWord) {
      return response.status(404).json({
        error: 'Word not found.',
      });
    }

    return response.status(200).json({
      word: updatedWord,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
});

// Delete a word by ID
Router.delete('/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const deletedWord = await WordModel.findByIdAndDelete(id);

    if (!deletedWord) {
      return response.status(404).json({
        error: 'Word not found.',
      });
    }

    return response.status(200).json({
      word: deletedWord,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message,
    });
  }
});

module.exports = Router;
