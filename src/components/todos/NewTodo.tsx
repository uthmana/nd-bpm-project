'use client';
import { useRouter } from 'next/navigation';
import { Todo } from 'types/todo';

export const TodoItem = ({ todos }: { todos: Todo[] }) => {
  const router = useRouter();
  const update = async (todo: Todo) => {
    await fetch(`/api/todo/${todo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        completed: !todo.complete,
      }),
    });
    router.refresh();
  };

  const deleteTodo = async (todo: Todo) => {
    await fetch(`/api/todo/${todo.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: todo.id,
      }),
    });

    router.refresh();
  };
  return (
    <>
      {todos.map((todo) => {
        return (
          <li key={todo.id} className="flex px-4">
            <span className="flex flex-1 gap-2">
              <input
                type="checkbox"
                name="check"
                checked={todo.complete}
                onChange={() => update(todo)}
                className="accent-slate-300 peer cursor-pointer "
              />
              <label
                htmlFor={todo.id}
                className="peer-checked:text-slate-500 cursor-pointer peer-checked:line-through"
              >
                {todo.title}
              </label>
            </span>
            <button
              onClick={() => deleteTodo(todo)}
              className="text-slate-500  hover:text-slate-800 mr-3"
            >
              X
            </button>
          </li>
        );
      })}
    </>
  );
};
