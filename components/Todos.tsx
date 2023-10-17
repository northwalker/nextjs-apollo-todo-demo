import { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";

const READ_TODO = gql`
  query {
    todos {
      _id
      text
      completed
      createdAt
      updatedAt
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!, $completed: Boolean!) {
    createTodo(text: $text, completed: $completed) {
      _id
      text
      completed
      createdAt
      updatedAt
    }
  }
`;
const UPDATE_TODO = gql`
  mutation UpdateTodo($_id: ID!, $text: String, $completed: Boolean) {
    updateTodo(_id: $_id, text: $text, completed: $completed) {
      _id
      text
      completed
      createdAt
      updatedAt
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($_id: ID!) {
    deleteTodo(_id: $_id)
  }
`;

interface Todo {
  _id: String;
  text: String;
  completed: Boolean;
  createdAt: String;
  updatedAt: String;
}

const Todos = () => {
  const [text, setText] = useState("");
  const { loading, error, data, refetch } = useQuery(READ_TODO);
  const [createTodo] = useMutation(CREATE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const handleCreateTodo = async () => {
    if (!text) return;
    try {
      const { data } = await createTodo({
        variables: { text, completed: false },
      });
      console.log(`Todo ${data.createTodo.id} created:`, data.createTodo);
      refetch();
    } catch (error) {
      console.error("Create todo error:", error);
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    try {
      const { data } = await updateTodo({
        variables: { ...todo },
      });
      console.log(`Todo ${data.updateTodo._id} updated:`, data.updateTodo);
      refetch();
    } catch (error) {
      console.error("Update todo error:", error);
    }
  };
  const handleDeleteTodo = async (_id: String) => {
    try {
      const { data } = await deleteTodo({ variables: { _id } });
      console.log(`Todo ${_id} deleted:`, data.deleteTodo);
      refetch();
    } catch (error) {
      console.error("Delete todo error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <h1>Todos</h1>
      <div>
        <input type="text" onChange={(e) => setText(e.target.value)} />{" "}
        <button onClick={handleCreateTodo}> Create </button>
      </div>
      <div>
        {data?.todos.map((todo: Todo, index: number) => (
          <div key={`${todo._id}`}>
            {!todo.completed ? (
              <span>
                {index + 1}. {todo.text} : (
                {todo.completed ? "Done" : "Pending"})
              </span>
            ) : (
              <del>
                {index + 1}. {todo.text} : (
                {todo.completed ? "Done" : "Pending"}){" "}
              </del>
            )}
            <button
              onClick={() => {
                handleUpdateTodo({
                  ...todo,
                  completed: !todo.completed,
                });
              }}
            >
              {!todo.completed ? "Complete" : "Pending"}
            </button>{" "}
            <button
              onClick={() => {
                handleDeleteTodo(todo._id);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
