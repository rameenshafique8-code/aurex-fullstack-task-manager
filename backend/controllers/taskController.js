const Task = require("../models/Task");

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks"
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Task title must be at least 2 characters"
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      user: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create task"
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const { title, description, completed } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Task title must be at least 2 characters"
        });
      }

      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Completed must be true or false"
        });
      }

      task.completed = completed;
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update task"
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete task"
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};