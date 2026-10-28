import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [mode, setMode] = useState("login");
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async (path, options = {}, authToken = token) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(authToken
          ? { Authorization: `Bearer ${authToken}` }
          : {}),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  };

  const loadTasks = async (authToken = token) => {
    const data = await request("/tasks", {}, authToken);
    setTasks(data.tasks || []);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setTasks([]);
    setTitle("");
    setDescription("");
    setEditId(null);
    setMessage("");
    setError("");
    setMode("login");
  };

  useEffect(() => {
    if (!token) return;

    let active = true;

    const restoreSession = async () => {
      try {
        const data = await request("/auth/me", {}, token);

        if (!active) return;

        setUser(data.user);
        await loadTasks(token);
      } catch {
        if (active) {
          logout();
          setError("Please log in again to continue.");
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, [token]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const form = new FormData(event.currentTarget);

    const payload = {
      email: form.get("email"),
      password: form.get("password"),
    };

    if (mode === "register") {
      payload.name = form.get("name");
    }

    try {
      const endpoint =
        mode === "register" ? "/auth/register" : "/auth/login";

      const data = await request(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        ""
      );

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setToken(data.token);
      setMessage(data.message || "Welcome!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (title.trim().length < 2) {
      setError("Task title must be at least 2 characters.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
      };

      if (editId) {
        await request(`/tasks/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setMessage("Task updated successfully.");
      } else {
        await request("/tasks", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setMessage("Task created successfully.");
      }

      setTitle("");
      setDescription("");
      setEditId(null);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTask = async (task) => {
    setError("");
    setMessage("");

    try {
      await request(`/tasks/${task._id}`, {
        method: "PUT",
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await request(`/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks((current) =>
        current.filter((task) => task._id !== id)
      );

      if (editId === id) {
        setEditId(null);
        setTitle("");
        setDescription("");
      }

      setMessage("Task deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  if (!token || !user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand-mark">A</div>
          <p className="eyebrow">AUREX WORKSPACE</p>
          <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="muted">
            {mode === "login"
              ? "Sign in to manage your tasks."
              : "Register to start organizing your work."}
          </p>

          {error && <div className="notice error">{error}</div>}
          {message && <div className="notice success">{message}</div>}

          <form className="auth-form" onSubmit={handleAuth}>
            {mode === "register" && (
              <label>
                Full name
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  minLength="2"
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="At least 8 characters"
                minLength="8"
                required
              />
            </label>

            <button className="primary-btn full-btn" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <p className="switch-text">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              className="text-btn"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setMessage("");
              }}
            >
              {mode === "login" ? " Register" : " Sign in"}
            </button>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark small-mark">A</span>
          <span>Aurex <span className="brand-light">Tasks</span></span>
        </a>

        <div className="account">
          <div className="avatar">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="account-name">{user.name}</span>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <section className="welcome-section" id="home">
        <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
        <h1>Let's get things done.</h1>
        <p className="muted">
          Organize your day, track your progress, and stay focused.
        </p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-label">Total tasks</span>
          <strong>{tasks.length}</strong>
          <span className="stat-note">All your tasks</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Completed</span>
          <strong>{completedCount}</strong>
          <span className="stat-note">Tasks finished</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Remaining</span>
          <strong>{tasks.length - completedCount}</strong>
          <span className="stat-note">Still in progress</span>
        </article>
      </section>

      {error && <div className="notice error">{error}</div>}
      {message && <div className="notice success">{message}</div>}

      <section className="content-grid">
        <article className="panel task-form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                {editId ? "UPDATE TASK" : "GET STARTED"}
              </p>
              <h2>{editId ? "Edit your task" : "Create a task"}</h2>
            </div>
          </div>

          <form className="task-form" onSubmit={handleTaskSubmit}>
            <label>
              Task title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What do you need to do?"
                minLength="2"
                maxLength="100"
                required
              />
            </label>

            <label>
              Description <span className="optional">(optional)</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add some details..."
                rows="4"
                maxLength="500"
              />
            </label>

            <button className="primary-btn full-btn" disabled={loading}>
              {loading
                ? "Saving..."
                : editId
                  ? "Save Changes"
                  : "+ Add Task"}
            </button>

            {editId && (
              <button
                type="button"
                className="secondary-btn full-btn"
                onClick={() => {
                  setEditId(null);
                  setTitle("");
                  setDescription("");
                  setError("");
                }}
              >
                Cancel Editing
              </button>
            )}
          </form>
        </article>

        <article className="panel tasks-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR WORK</p>
              <h2>My tasks</h2>
            </div>
            <span className="task-count">{tasks.length} total</span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>Create your first task using the form.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article
                  className={`task-item ${task.completed ? "is-complete" : ""}`}
                  key={task._id}
                >
                  <button
                    className={`check-btn ${task.completed ? "checked" : ""}`}
                    onClick={() => toggleTask(task)}
                    aria-label={
                      task.completed
                        ? "Mark task incomplete"
                        : "Mark task complete"
                    }
                    title="Toggle completion"
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-details">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                    <span className="status-label">
                      {task.completed ? "Completed" : "In progress"}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      className="action-btn"
                      onClick={() => startEdit(task)}
                      title="Edit task"
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-action"
                      onClick={() => deleteTask(task._id)}
                      title="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>

      <footer className="footer">
        Aurex Task Management System · Built for productive work
      </footer>
    </main>
  );
}

export default App;
