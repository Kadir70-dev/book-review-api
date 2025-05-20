const express = require('express');
const router = express.Router();
const { addBook, getBooks, getBookById, searchBooks } = require('../controllers/bookController');
const auth = require('../middleware/authMiddleware');
const { addReview } = require('../controllers/reviewController');

router.post('/', auth, addBook);
router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);
router.post('/:id/reviews', auth, addReview);

module.exports = router;
