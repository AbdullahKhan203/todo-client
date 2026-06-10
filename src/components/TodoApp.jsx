import { useEffect, useState } from "react";
import API from "../services/api";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // GET TODOS
  const fetchTodos = async () => {
    const res = await API.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ADD TODO
  const addTodo = async () => {
    if (!text.trim()) return;

    await API.post("/todos", { text });
    setText("");
    fetchTodos();
  };

  // DELETE TODO
  const deleteTodo = async (id) => {
    await API.delete(`/todos/${id}`);
    fetchTodos();
  };

  // START EDIT
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  // SAVE EDIT (on blur)
  const saveEdit = async (id) => {
    const todo = todos.find((t) => t._id === id);

    await API.put(`/todos/${id}`, {
      text: editText,
      completed: todo.completed,
    });

    setEditingId(null);
    fetchTodos();
  };

  // TOGGLE STATUS
  const toggleStatus = async (todo) => {
    await API.patch(`/todos/${todo._id}/status`, {
      completed: !todo.completed,
    });

    fetchTodos();
  };

  return (
    <div
  style={{
    maxWidth: "500px",
    margin: "50px auto",
    fontFamily: "sans-serif",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  }}
>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
  My Todo App
</h2>

      {/* INPUT */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter todo"
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      {/* LIST */}
      <ul style={{ marginTop: "20px", padding: 0, listStyle: "none" }}>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            {/* TEXT / EDIT */}
            {editingId === todo._id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(todo._id)}
                autoFocus
                style={{ flex: 1 }}
              />
            ) : (
              <span
                onClick={() => startEdit(todo)}
                style={{
                  cursor: "pointer",
                  textDecoration: todo.completed ? "line-through" : "none",
                  flex: 1,
                }}
              >
                {todo.text}
              </span>
            )}

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => toggleStatus(todo)}>✔</button>
              <button onClick={() => deleteTodo(todo._id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}