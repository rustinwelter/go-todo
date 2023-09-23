import { List } from "@mantine/core";

import useSWR from "swr";

import AddTodo from "./AddTodo";

import { Todo } from "./TodoCard";

import TodoCard from "./TodoCard";

const fetcher = (url: string) =>
  fetch(`${import.meta.env.VITE_ENDPOINT}/${url}`).then((r) => r.json());

function TodoPage() {
  const { data, mutate } = useSWR<Todo[]>("api/todos", fetcher);

  return (
    <>
      <List size={"lg"} mb={40} center>
        {data?.map((todo, index) => (
          <TodoCard todo={todo} mutate={mutate} key={index} />
        ))}
      </List>
      <AddTodo mutate={mutate} />
    </>
  );
}

export default TodoPage;
