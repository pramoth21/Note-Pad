const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/search', noteController.searchNotes);

router.route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNote);

router.route('/:id')
    .get(noteController.getNote)
    .patch(noteController.updateNote)
    .delete(noteController.deleteNote);

router.post('/:id/collaborators', noteController.addCollaborator);
router.delete('/:id/collaborators', noteController.removeCollaborator);

module.exports = router;
