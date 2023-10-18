import { useState, useCallback } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import {
  Container,
  Skeleton,
  Grid,
  TextField,
  Button,
  List,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TodoItem from "./TodoItem";

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

const LoadingElement = () => {
  return (
    <Container maxWidth={"sm"}>
      <Skeleton animation="wave" height={120} />
      <Skeleton animation="wave" height={80} />
      <Skeleton animation="wave" height={60} />
      <Skeleton animation="wave" height={48} />
      <Skeleton animation="wave" height={48} />
    </Container>
  );
};

const TodoList = () => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, error, data, refetch } = useQuery(READ_TODO);
  const [createTodo] = useMutation(CREATE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleCreateTodo();
    setText(""); // clear input
    setIsSubmitting(false);
  };

  const handleCreateTodo = useCallback(async () => {
    const newText = text?.trim();
    if (!newText) return;
    try {
      const { data } = await createTodo({
        variables: { text: newText, completed: false },
      });
      console.log(`Todo ${data.createTodo.id} created:`, data.createTodo);
      refetch();
    } catch (error) {
      console.error("Create todo error:", error);
    }
  }, [text, createTodo, refetch]);

  const handleUpdateTodo = useCallback(
    async (todo: Todo) => {
      try {
        const { data } = await updateTodo({
          variables: { ...todo },
        });
        console.log(`Todo ${data.updateTodo._id} updated:`, data.updateTodo);
        refetch();
      } catch (error) {
        console.error("Update todo error:", error);
      }
    },
    [updateTodo, refetch]
  );

  const handleDeleteTodo = useCallback(
    async (_id: String) => {
      try {
        const { data } = await deleteTodo({ variables: { _id } });
        console.log(`Todo ${_id} deleted:`, data.deleteTodo);
        refetch();
      } catch (error) {
        console.error("Delete todo error:", error);
      }
    },
    [deleteTodo, refetch]
  );

  if (loading) {
    return <LoadingElement />;
  }

  if (error) {
    return <Container>{!!error && error.message}</Container>;
  }

  return (
    <Container maxWidth="sm">
      <h1>Todo List</h1>
      <div>
        <form noValidate autoComplete="off" onSubmit={handleOnSubmit}>
          <Grid
            container
            direction="row"
            // justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={8}>
              <TextField
                id="standard-basic"
                autoComplete="off"
                label="New Todo"
                variant="standard"
                fullWidth
                inputProps={{ maxLength: 1000 }}
                placeholder="Type something to do..."
                disabled={isSubmitting}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                aria-label="Add doto"
                variant="contained"
                onClick={handleOnSubmit}
                startIcon={<AddIcon />}
                disabled={isSubmitting}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <div>
        <List>
          {data?.todos.map((todo: Todo, index: number) => {
            return (
              <TodoItem
                key={index}
                todo={todo}
                index={index}
                handleUpdateTodo={handleUpdateTodo}
                handleDeleteTodo={handleDeleteTodo}
              />
            );
          })}
        </List>
      </div>
    </Container>
  );
};

export default TodoList;
