import { List, Grid, ThemeIcon, Text, Paper } from "@mantine/core";

import { CheckCircleIcon, TrashIcon } from "@primer/octicons-react";

import { KeyedMutator } from "swr";

export type Todo = {
  id: number;
  title: string;
  body: string;
  done: boolean;
};

function TodoCard(props: { todo: Todo; mutate: KeyedMutator<Todo[]> }) {
  const todo = props.todo;
  const mutate = props.mutate;

  async function markTodoAsDone(id: number) {
    const updated = await fetch(
      `${import.meta.env.VITE_ENDPOINT}/api/todos/${id}/done`,
      {
        method: "PATCH",
      }
    ).then((r) => r.json());

    mutate(updated);
  }

  async function unmarkTodoAsDone(id: number) {
    const updated = await fetch(
      `${import.meta.env.VITE_ENDPOINT}/api/todos/${id}/undone`,
      {
        method: "PATCH",
      }
    ).then((r) => r.json());

    mutate(updated);
  }

  async function deleteTodo(id: number) {
    const updated = await fetch(
      `${import.meta.env.VITE_ENDPOINT}/api/todos/${id}`,
      {
        method: "DELETE",
      }
    ).then((r) => r.json());

    mutate(updated);
  }

  return (
    <Paper
      radius="md"
      p="md"
      mb={20}
      withBorder
      sx={(theme) =>
        theme.colorScheme === "dark"
          ? {
              cursor: "pointer",
              transition: "150ms",
              ":hover": { backgroundColor: theme.colors.dark[9] },
            }
          : {
              cursor: "pointer",
              transition: "150ms",
              boxShadow: theme.shadows["xs"],
              ":hover": {
                transform: "translateY(-3px)",
                boxShadow: theme.shadows["lg"],
              },
            }
      }
    >
      <Grid>
        <Grid.Col span={10}>
          <List.Item
            onClick={() => {
              todo.done ? unmarkTodoAsDone(todo.id) : markTodoAsDone(todo.id);
            }}
            key={`todo_${todo.id}`}
            icon={
              <ThemeIcon
                color={todo.done ? "teal.4" : "gray.6"}
                size={32}
                radius={"xl"}
                sx={{ transition: "100ms" }}
              >
                <CheckCircleIcon size={24} />
              </ThemeIcon>
            }
          >
            <Text fz={"xl"} fw={900}>
              {todo.title}
            </Text>
            <Text fz={"sm"}>{todo.body}</Text>
          </List.Item>
        </Grid.Col>
        <Grid.Col span={2}>
          <ThemeIcon
            onClick={() => deleteTodo(todo.id)}
            size={32}
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[6],
              transition: "100ms",
              ":hover": { backgroundColor: theme.colors.gray[8] },
            })}
          >
            <TrashIcon size={24} />
          </ThemeIcon>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export default TodoCard;
