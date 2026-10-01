import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    column: { type: mongoose.Schema.Types.ObjectId, ref: "Column", required: true },
    order: { type: Number, required: true, default: 0 },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
