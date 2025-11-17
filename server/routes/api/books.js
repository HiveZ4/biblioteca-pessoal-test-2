const express = require('express');
const router = express.Router();
const bookController = require('../../controllers/bookController');
const { authenticateToken } = require('../../middleware/authMiddleware');


router.use(authenticateToken);


router.get('/', bookController.getBooks);
router.post('/addBook', bookController.addBook);
router.get('/editBook/:id', bookController.getBook);
router.put('/editBook/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);


router.patch('/:id/progress', bookController.updateProgress);
router.patch('/:id/rating', bookController.updateRating);

module.exports = router;