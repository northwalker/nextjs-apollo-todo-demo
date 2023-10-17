import dbConnect from "../lib/dbConnect";
import Todo from "../models/Todo";

export const resolvers = {
  Query: {
    todos: async () => {
      let data = [];
      try {
        await dbConnect();
        data = await Todo.find({});
      } catch (error) {
        console.error("Query todos error", error);
      }
      return data;
    },
    todo: async (parent: any, { _id }) => await Todo.findById(_id),
  },
  Mutation: {
    createTodo: async (parent: any, { text }) => {
      const newTodo = {
        text,
        completed: false,
      };
      const todo = await Todo.create(newTodo);
      return todo;
    },
    updateTodo: async (parent: any, { _id, text, completed }) => {
      const todo = await Todo.findByIdAndUpdate(
        _id,
        {
          text,
          completed,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!todo) {
        throw new Error("Todo not found");
      }
      return todo;
    },
    deleteTodo: async (parent: any, { _id }) => {
      try {
        const deletedTodo = await Todo.deleteOne({ _id });
        return deletedTodo?.acknowledged;
      } catch (error) {
        return false;
      }
    },
  },
};
