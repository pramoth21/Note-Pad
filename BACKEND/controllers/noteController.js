const Note = require('../models/Note');
const User = require('../models/User');

exports.createNote = async (req, res) => {
    try {
        const newNote = await Note.create({
            title: req.body.title,
            content: req.body.content,
            owner: req.user._id
        });

        res.status(201).json({
            status: 'success',
            data: {
                note: newNote
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAllNotes = async (req, res) => {
    try {
        // Find notes where user is owner OR a collaborator
        const notes = await Note.find({
            $or: [
                { owner: req.user._id },
                { collaborators: req.user._id }
            ]
        }).populate('owner', 'name email').populate('collaborators', 'name email');

        res.status(200).json({
            status: 'success',
            results: notes.length,
            data: {
                notes
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getNote = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.user._id },
                { collaborators: req.user._id }
            ]
        }).populate('owner', 'name email').populate('collaborators', 'name email');

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                note
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                $or: [
                    { owner: req.user._id },
                    { collaborators: req.user._id }
                ]
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found or no permission' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                note
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        // Only owner can delete
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!note) {
            return res.status(404).json({ message: 'Note not found or you are not the owner' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.searchNotes = async (req, res) => {
    try {
        const { q } = req.query;
        const notes = await Note.find(
            {
                $text: { $search: q },
                $or: [
                    { owner: req.user._id },
                    { collaborators: req.user._id }
                ]
            }
        ).populate('owner', 'name email');

        res.status(200).json({
            status: 'success',
            results: notes.length,
            data: {
                notes
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.addCollaborator = async (req, res) => {
    try {
        const { email } = req.body;
        const noteId = req.params.id;

        // Find user by email
        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only owner can add collaborator
        const note = await Note.findOneAndUpdate(
            { _id: noteId, owner: req.user._id },
            { $addToSet: { collaborators: userToAdd._id } },
            { new: true }
        ).populate('collaborators', 'name email');

        if (!note) {
            return res.status(404).json({ message: 'Note not found or you are not the owner' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                note
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.removeCollaborator = async (req, res) => {
    try {
        const { collaboratorId } = req.body;
        const noteId = req.params.id;

        // Only owner can remove collaborator
        const note = await Note.findOneAndUpdate(
            { _id: noteId, owner: req.user._id },
            { $pull: { collaborators: collaboratorId } },
            { new: true }
        ).populate('collaborators', 'name email');

        if (!note) {
            return res.status(404).json({ message: 'Note not found or you are not the owner' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                note
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
