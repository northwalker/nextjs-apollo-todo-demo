import { useState, useCallback } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import {
  Container,
  Stack,
  Grid,
  Button,
  IconButton,
  Checkbox,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState(null);
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

  const handleEditTodoStart = useCallback(
    async (todo: Todo) => {
      setEditingText(todo.text);
      setEditingId(todo._id);
    },
    [setEditingText, setEditingId]
  );

  const handleEditTodoEnd = useCallback(
    async (todo: Todo) => {
      setEditingId(null);
      const newText = editingText.trim();
      if (todo && newText && todo.text !== newText) {
        await handleUpdateTodo({
          ...todo,
          text: newText,
        });
      }
      setEditingText("");
    },
    [editingText, setEditingText, setEditingId, handleUpdateTodo]
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

  if (loading || error) {
    return (
      <div>
        <Typography variant="h3" component="h3">
          {loading ? "Loading..." : "Error..."}
        </Typography>
        <div>{!!error && error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <Container maxWidth="sm">
        <Typography variant="h1" component="h1">
          Todos
        </Typography>
        <div>
          <form noValidate autoComplete="off" onSubmit={handleOnSubmit}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={8}>
                <TextField
                  id="standard-basic"
                  autoComplete="off"
                  label="New Todo"
                  variant="standard"
                  fullWidth
                  inputProps={{ maxLength: 1000 }}
                  value={text}
                  placeholder="Type something to do..."
                  onChange={(e) => setText(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  onClick={handleOnSubmit}
                  startIcon={<AddIcon />}
                  disabled={isSubmitting}
                >
                  Add Todo
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
        <div>
          <List>
            {data?.todos.map((todo: Todo, index: number) => {
              const labelId = `${todo._id}`;
              const isTodoEditing = labelId === editingId;

              if (isTodoEditing) {
                return (
                  <ListItem
                    key={labelId}
                    disablePadding
                    secondaryAction={
                      <Stack direction="row" spacing={2}>
                        <IconButton
                          edge="end"
                          aria-label="Edit completed"
                          color="info"
                          disabled={!editingText}
                          onClick={() => {
                            handleEditTodoEnd(todo);
                          }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="Edit cancel"
                          color="info"
                          onClick={() => {
                            handleEditTodoEnd(null);
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <TextField
                      label="Edit todo content"
                      variant="outlined"
                      size="small"
                      value={editingText}
                      fullWidth
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                  </ListItem>
                );
              }

              const ListItemTextContent = todo.completed ? (
                <del>{`${index + 1}. ${todo.text}`}</del>
              ) : (
                <span>{`${index + 1}. ${todo.text}`}</span>
              );
              return (
                <ListItem
                  key={labelId}
                  disablePadding
                  secondaryAction={
                    <Stack direction="row" spacing={2}>
                      <Tooltip title="Etid">
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          color="info"
                          onClick={() => {
                            handleEditTodoStart({ ...todo });
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="info"
                          onClick={() => {
                            handleDeleteTodo(todo._id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={Boolean(todo.completed)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      onClick={() => {
                        handleUpdateTodo({
                          ...todo,
                          completed: !todo.completed,
                        });
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={`${todo._id}`}
                    primary={ListItemTextContent}
                  />
                </ListItem>
              );
            })}
          </List>
        </div>
      </Container>
    </div>
  );
};

export default Todos;
