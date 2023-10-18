import {
  Stack,
  IconButton,
  Checkbox,
  TextField,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useCallback, useState } from "react";

interface Todo {
  _id: String;
  text: String;
  completed: Boolean;
  createdAt: String;
  updatedAt: String;
}

type Props = {
  todo: Todo;
  index: number;
  handleUpdateTodo: Function;
  handleDeleteTodo: Function;
};

const TodoItem = ({
  todo,
  index,
  handleDeleteTodo,
  handleUpdateTodo,
}: Props) => {
  const labelId = `${todo._id}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEdting] = useState(false);
  const [editingText, setEditingText] = useState("");

  const handleEditTodo = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      setIsSubmitting(true);
      const newText = editingText.trim();
      if (newText && todo.text !== newText) {
        await handleUpdateTodo({
          ...todo,
          text: newText,
        });
      }
      setIsEdting(false);
      setEditingText("");
      setIsSubmitting(false);
    },
    [editingText, todo, handleUpdateTodo]
  );

  if (isEditing) {
    return (
      <form autoComplete="off" onSubmit={handleEditTodo}>
        <ListItem
          key={labelId}
          disablePadding
          secondaryAction={
            <Stack direction="row" spacing={2}>
              <IconButton
                edge="end"
                aria-label="Completed"
                color="info"
                disabled={!editingText || isSubmitting}
                onClick={handleEditTodo}
              >
                <CheckCircleIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="Cancel"
                color="info"
                disabled={isSubmitting}
                onClick={() => {
                  setIsEdting(false);
                  setEditingText("");
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
            fullWidth
            value={editingText}
            disabled={isSubmitting}
            onChange={(e) => setEditingText(e.target.value)}
          />
        </ListItem>
      </form>
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
              aria-label="Edit todo"
              color="info"
              onClick={() => {
                setEditingText(`${todo.text}`);
                setIsEdting(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              edge="end"
              aria-label="Remove todo"
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
          inputProps={{ "aria-labelledby": labelId }}
          onClick={() => {
            handleUpdateTodo({
              ...todo,
              completed: !todo.completed,
            });
          }}
        />
      </ListItemIcon>
      <ListItemText id={`${todo._id}`} primary={ListItemTextContent} />
    </ListItem>
  );
};

export default TodoItem;
