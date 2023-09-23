import { useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, Modal, TextInput, Textarea } from "@mantine/core";
import { KeyedMutator } from "swr";
import { Todo } from "./TodoCard";

function AddTodo({ mutate }: { mutate: KeyedMutator<Todo[]> }) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    initialValues: {
      title: "",
      body: "",
    },
  });

  async function createTodo(values: { title: string; body: string }) {
    const updated = await fetch(`${import.meta.env.VITE_ENDPOINT}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((r) => r.json());

    mutate(updated);
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title={import.meta.env.VITE_APP_NAME}
      >
        <form onSubmit={form.onSubmit(createTodo)}>
          <TextInput
            required
            mb={12}
            label="ToDo"
            placeholder="What is on your list?"
            description="40 characters"
            {...form.getInputProps("title")}
            maxLength={40}
          />
          <Textarea
            mb={12}
            placeholder="Anything else you want to mention?"
            description="100 characters"
            {...form.getInputProps("body")}
            maxLength={100}
            minRows={2}
            maxRows={4}
            autosize
          />
          <Button type="submit" color="pink.6">
            Add ToDo!
          </Button>
        </form>
      </Modal>
      <Group position="center">
        <Button
          fullWidth
          mb={12}
          onClick={() => setOpen(true)}
          color="pink.6"
          radius={"sm"}
        >
          Add ToDo!
        </Button>
      </Group>
    </>
  );
}

export default AddTodo;
