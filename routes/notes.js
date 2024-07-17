const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    const newNote = new Note({
      text,
      user: req.user.id  // Assuming the auth middleware adds user info to req.user
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error("Error in POST /api/notes:", err);
    res.status(500).json({ message: "Error adding note", error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { text: req.body.text },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;