import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    text: String,
    completed: Boolean,
  },
  {
    timestamps: true,
  }
);

// const Todo = mongoose.models.Todo ?? mongoose.model("Todo", TodoSchema);

let Todo;
if (mongoose.models && mongoose.models.Todo) Todo = mongoose.models.Todo;
else Todo = mongoose.model("Todo", TodoSchema);

export default Todo;
