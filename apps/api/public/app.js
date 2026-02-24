import React, { useEffect, useMemo, useState } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

const formatTime = (iso) => {
  if (!iso) return 'Just now';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const api = {
  list: async () => {
    const res = await fetch('/todos');
    if (!res.ok) throw new Error('Failed to load todos');
    return res.json();
  },
  create: async (title) => {
    const res = await fetch('/todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
  },
  update: async (id, updates) => {
    const res = await fetch(`/todos/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
  },
  remove: async (id) => {
    const res = await fetch(`/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete todo');
  },
};

const StatusPill = ({ label, value }) =>
  html`<div
    className="flex items-center gap-2 rounded-full bg-canvas-muted px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink-muted"
  >
    <span className="pulse block h-2 w-2 rounded-full bg-accent"></span>
    <span>${label}</span>
    <span className="text-ink">${value}</span>
  </div>`;

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const meta = todo.completed ? 'Complete' : `Updated · ${formatTime(todo.updatedAt)}`;
  return html`<article
    className=${`group relative flex items-center gap-4 rounded-2xl border border-transparent bg-canvas-subtle px-5 py-4 shadow-sm transition duration-300 hover:border-canvas-muted hover:shadow-soft ${
      todo.completed ? 'opacity-60' : ''
    }`}
  >
    <button
      className=${`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
        todo.completed
          ? 'border-success bg-success text-white'
          : 'border-ink-faint text-transparent hover:border-accent'
      }`}
      aria-label=${todo.completed ? 'Mark incomplete' : 'Mark complete'}
      onClick=${() => onToggle(todo)}
    >
      <svg viewBox="0 0 20 20" className="h-3 w-3">
        <path
          d="M7.7 13.3 4.4 10l1.2-1.2 2.1 2.1 5.2-5.2 1.2 1.2z"
          fill="currentColor"
        />
      </svg>
    </button>
    <div className="flex-1">
      <p
        className=${`text-base font-medium ${
          todo.completed ? 'line-through decoration-ink-faint text-ink-muted' : ''
        }`}
      >
        ${todo.title}
      </p>
      <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ink-faint">
        ${meta}
      </p>
    </div>
    <button
      className="opacity-0 transition group-hover:opacity-100"
      aria-label="Delete todo"
      onClick=${() => onDelete(todo)}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-ink-faint transition hover:text-danger"
      >
        <path
          d="M7 6h10m-8 0 1-2h4l1 2m-8 3v9m6-9v9M5 6h14"
          stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </article>`;
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const remaining = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.list();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Unable to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    const title = input.trim();
    if (!title) return;
    setInput('');
    try {
      const next = await api.create(title);
      setTodos((prev) => [next, ...prev]);
    } catch (err) {
      setError(err.message || 'Unable to create todo');
    }
  };

  const handleToggle = async (todo) => {
    try {
      const updated = await api.update(todo.id, { completed: !todo.completed });
      setTodos((prev) => prev.map((item) => (item.id === todo.id ? updated : item)));
    } catch (err) {
      setError(err.message || 'Unable to update todo');
    }
  };

  const handleDelete = async (todo) => {
    try {
      await api.remove(todo.id);
      setTodos((prev) => prev.filter((item) => item.id !== todo.id));
    } catch (err) {
      setError(err.message || 'Unable to delete todo');
    }
  };

  return html`<div className="grid-halo min-h-screen">
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16">
      <header className="fade-in mb-14 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-ink-faint">
              Eve Horizon
            </p>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">
              Luminous Todos
            </h1>
          </div>
          <${StatusPill} label="Remaining" value=${remaining} />
        </div>
        <p className="max-w-2xl text-base text-ink-muted">
          A single-container showcase that pairs an in-memory API with a polished
          React + Tailwind experience. Every action writes directly to the live
          service.
        </p>
      </header>

      <section className="fade-in rounded-[32px] border border-canvas-muted bg-white/60 p-8 shadow-soft backdrop-blur">
        <form onSubmit=${handleAdd} className="mb-6">
          <label className="text-xs uppercase tracking-[0.35em] text-ink-faint">
            Add a new todo
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value=${input}
              onInput=${(event) => setInput(event.target.value)}
              placeholder="Ship a stellar UI"
              className="w-full rounded-2xl border border-dashed border-ink-faint/50 bg-transparent px-5 py-4 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-2xl bg-ink px-6 py-4 text-sm uppercase tracking-[0.3em] text-canvas transition hover:bg-ink/90"
            >
              Create
            </button>
          </div>
        </form>

        ${error
          ? html`<div className="mb-5 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              ${error}
            </div>`
          : null}

        <div className="space-y-4">
          ${loading
            ? html`<div className="rounded-2xl border border-canvas-muted bg-canvas-subtle px-5 py-6 text-sm text-ink-muted">
                Syncing the timeline...
              </div>`
            : todos.length === 0
              ? html`<div className="rounded-2xl border border-dashed border-ink-faint/40 px-5 py-10 text-center text-sm text-ink-muted">
                  No todos yet. Add your first one above.
                </div>`
              : todos.map(
                  (todo) =>
                    html`<${TodoItem}
                      key=${todo.id}
                      todo=${todo}
                      onToggle=${handleToggle}
                      onDelete=${handleDelete}
                    />`
                )}
        </div>
      </section>

      <footer className="mt-10 text-xs uppercase tracking-[0.3em] text-ink-faint">
        Powered by `/todos` · `/openapi.json`
      </footer>
    </div>
  </div>`;
};

const root = createRoot(document.getElementById('app'));
root.render(html`<${App} />`);
