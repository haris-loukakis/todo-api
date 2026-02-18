const Todo = require('../models/Todo');


exports.createTodo = async (req, res) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
      user: req.user.id,
      items: []
    });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.updateTodo = async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete todo
// @route   DELETE /todos/:id
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await todo.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.addItem = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });

    const newItem = { text: req.body.text };
    todo.items.push(newItem);
    await todo.save();

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//Update Item 
exports.updateItem = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });

    const item = todo.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });

    if (req.body.text) item.text = req.body.text;
    if (req.body.completed !== undefined) item.completed = req.body.completed;

    await todo.save();

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//Delete Item 
exports.deleteItem = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ success: false, error: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });

    // Αφαίρεση item από τον πίνακα
    todo.items.pull(req.params.itemId);
    
    await todo.save();

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};