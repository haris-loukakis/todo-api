const express = require('express');
const router = express.Router();
const { createTodo, getTodos, getTodo, updateTodo, deleteTodo, addItem, updateItem, deleteItem } = require('../controllers/todoController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createTodo).get(protect, getTodos);
router.route('/:id').get(protect, getTodo).put(protect, updateTodo).delete(protect, deleteTodo);
router.route('/:id/items').post(protect, addItem);
router.route('/:id/items/:itemId').put(protect, updateItem).delete(protect, deleteItem);

module.exports = router;