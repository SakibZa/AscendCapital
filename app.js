const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create a List schema
const listSchema = new mongoose.Schema({
  name: String,
  userId: mongoose.Schema.Types.ObjectId,
});

// Create a Task schema
const taskSchema = new mongoose.Schema({
  title: String,
  listId: mongoose.Schema.Types.ObjectId,
  completed: Boolean,
});

// Define models
const User = mongoose.model('User', userSchema);
const List = mongoose.model('List', listSchema);
const Task = mongoose.model('Task', taskSchema);

app.use(express.json());



// User registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.create({ username, password });
      return res.status(201).json({ message: 'Registration successful', user });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // ...
  


// User login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new list endpoint
app.post('/lists', async (req, res) => {
  const { name, userId } = req.body;

  try {
    const newList = await List.create({ name, userId });
    return res.status(201).json(newList);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all lists for a user endpoint
app.get('/lists/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const lists = await List.find({ userId });
    return res.status(200).json(lists);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ...

// Create a new task endpoint
app.post('/tasks', async (req, res) => {
    const { title, listId } = req.body;
  
    try {
      const newTask = await Task.create({ title, listId, completed: false });
      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get all tasks for a list endpoint
  app.get('/tasks/:listId', async (req, res) => {
    const { listId } = req.params;
  
    try {
      const tasks = await Task.find({ listId });
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // ...
  

// Update task listId endpoint
app.put('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { listId } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { listId }, { new: true });
    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark task as completed endpoint
app.put('/tasks/:taskId/complete', async (req, res) => {
  const { taskId } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { completed: true }, { new: true });
    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
