import React, { useState, useEffect } from "react";

function TodoList() {
  // Stati per le to-do, il caricamento e gli errori
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState(""); // Stato per il nuovo titolo

  // Effetto per caricare le to-do quando il componente viene montato
  useEffect(() => {
    fetchTodos();
  }, []);

  // Funzione per recuperare le to-do
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5001/todos");
      if (!response.ok) throw new Error("Errore nel caricamento delle to-do");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per aggiungere una nuova to-do
  const addTodo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5001/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo, completed: false }),
      });
      if (!response.ok) throw new Error("Errore nell'aggiunta della to-do");
      const newTodoItem = await response.json();
      setTodos([...todos, newTodoItem]);
      setNewTodo(""); // Resetta il campo input
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per aggiornare una to-do
  const toggleTodo = async (id, completed) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5001/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!response.ok)
        throw new Error("Errore nell'aggiornamento della to-do");
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per eliminare una to-do
  const deleteTodo = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5001/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error("Errore nella cancellazione della to-do");
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>To-do List</h1>

      {/* Campo input per aggiungere una nuova to-do */}
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Nuova to-do"
      />
      <button onClick={addTodo} disabled={loading}>
        Aggiungi
      </button>

      {/* Mostra il loader se il caricamento è attivo */}
      {loading && <p>Caricamento in corso...</p>}

      {/* Mostra un messaggio di errore se presente */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Elenco delle to-do */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
              onClick={() => toggleTodo(todo.id, todo.completed)}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)} disabled={loading}>
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
