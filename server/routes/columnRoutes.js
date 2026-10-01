import express from "express";
import { updateColumn, deleteColumn } from "../controllers/columnController.js";
import { createTask } from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/:id").put(updateColumn).delete(deleteColumn);
router.post("/:columnId/tasks", createTask);

export default router;
