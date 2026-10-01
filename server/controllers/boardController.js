import Board from "../models/Board.js";
import Column from "../models/Column.js";
import Task from "../models/Task.js";

const canAccessBoard = (board, userId) =>
  board.owner.toString() === userId.toString() ||
  board.members.some((m) => m.toString() === userId.toString());

// @desc    Get all boards the user owns or belongs to
// @route   GET /api/boards
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get one board with its columns and tasks
// @route   GET /api/boards/:id
export const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (!canAccessBoard(board, req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view this board" });
    }

    const columns = await Column.find({ board: board._id }).sort({ order: 1 });
    const tasks = await Task.find({ board: board._id }).sort({ order: 1 });

    const columnsWithTasks = columns.map((col) => ({
      ...col.toObject(),
      tasks: tasks.filter((t) => t.column.toString() === col._id.toString()),
    }));

    res.json({ ...board.toObject(), columns: columnsWithTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a board (seeds default To Do / In Progress / Done columns)
// @route   POST /api/boards
export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Board title is required" });

    const board = await Board.create({ title, owner: req.user._id, members: [] });

    const defaultColumns = ["To Do", "In Progress", "Done"];
    const columns = await Column.insertMany(
      defaultColumns.map((colTitle, index) => ({
        title: colTitle,
        board: board._id,
        order: index,
      }))
    );

    res.status(201).json({ ...board.toObject(), columns: columns.map((c) => ({ ...c.toObject(), tasks: [] })) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Rename a board
// @route   PUT /api/boards/:id
export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can rename this board" });
    }
    board.title = req.body.title ?? board.title;
    await board.save();
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a board and everything in it
// @route   DELETE /api/boards/:id
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can delete this board" });
    }
    await Task.deleteMany({ board: board._id });
    await Column.deleteMany({ board: board._id });
    await board.deleteOne();
    res.json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { canAccessBoard };
