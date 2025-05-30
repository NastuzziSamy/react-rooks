import React, { useEffect } from "react";
import { createRook } from "react-rooks";
type LightColor = "green" | "orange" | "red";

// Global store with createRook
const [Rook, useRook] = createRook({
  defaultStore: {
    user: null as { id: number; name: string } | null,
    lightColor: "green" as LightColor,
    title: "My React App",
    counter: 0,
  },
});

const UserManager = () => {
  const [user, setUser] = useRook("user");

  const loginUser = () => {
    setUser({ id: Date.now(), name: "John Doe" });
  };

  const logoutUser = () => {
    setUser(null);
  };

  const updateUser = () => {
    setUser((prev: { id: number; name: string } | null) =>
      prev ? { ...prev, name: "Jane Doe" } : null
    );
  };

  return (
    <div className="demo-section">
      <h3>👤 User Management</h3>
      <div className="demo-controls">
        <button className="demo-button" onClick={loginUser}>
          Login
        </button>
        <button className="demo-button secondary" onClick={logoutUser}>
          Logout
        </button>
        <button
          className="demo-button secondary"
          onClick={updateUser}
          disabled={!user}
        >
          Change name
        </button>
      </div>
      <div className="demo-state">
        User: {user ? `${user.name} (ID: ${user.id})` : "Not logged in"}
      </div>
    </div>
  );
};

const TrafficLight = () => {
  const [light, setLight] = useRook("lightColor");
  const [timestamp, setTimestamp] = useRook("title");

  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      setTimestamp(now);

      setLight((prev) => {
        if (prev === "green") {
          return "orange";
        } else if (prev === "orange") {
          return "red";
        } else {
          return "green";
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [light, setLight, setTimestamp]);

  const forceLight = (newLight: LightColor) => {
    setLight(newLight);
    setTimestamp(new Date().toLocaleTimeString());
  };

  return (
    <div className="demo-section">
      <h3>🚦 Feu Tricolore</h3>
      <div className="demo-controls">
        <div className="traffic-light" style={{ display: "flex", gap: "10px" }}>
          <div
            className="light-display"
            style={{ fontSize: "3rem", cursor: "pointer" }}
            onClick={() => forceLight("green")}
          >
            <span style={{ opacity: light === "green" ? 1 : 0.3 }}>🟢</span>
          </div>
          <div
            className="light-display"
            style={{ fontSize: "3rem", cursor: "pointer" }}
            onClick={() => forceLight("orange")}
          >
            <span style={{ opacity: light === "orange" ? 1 : 0.3 }}>🟠</span>
          </div>
          <div
            className="light-display"
            style={{ fontSize: "3rem", cursor: "pointer" }}
            onClick={() => forceLight("red")}
          >
            <span style={{ opacity: light === "red" ? 1 : 0.3 }}>🔴</span>
          </div>
        </div>
      </div>
      <div className="demo-state">État actuel: {light}</div>
      <div className="demo-state">Dernier changement: {timestamp}</div>
      <div className="demo-info">
        💡 Le feu change automatiquement toutes les 2 secondes. Cliquez sur un
        feu pour forcer l'état.
      </div>
    </div>
  );
};

const Counter = () => {
  const [counter, setCounter] = useRook("counter");

  const increment = () => setCounter(counter + 1);
  const decrement = () => setCounter(counter - 1);
  const reset = () => setCounter(0);

  return (
    <div className="demo-section">
      <h3>🔢 Global Counter</h3>
      <div className="demo-controls">
        <button className="demo-button" onClick={increment}>
          + 1
        </button>
        <button className="demo-button" onClick={decrement}>
          - 1
        </button>
        <button className="demo-button secondary" onClick={reset}>
          Reset
        </button>
      </div>
      <div className="demo-state">Counter: {counter}</div>
    </div>
  );
};

const StoreDisplay = () => {
  const [store] = useRook();

  return (
    <div className="demo-section">
      <h3>📊 Complete Store State</h3>
      <div className="demo-state">{JSON.stringify(store, null, 2)}</div>
    </div>
  );
};

const ClassicExample = () => {
  return (
    <Rook>
      <div className="example-demo">
        <div className="demo-info">
          <strong>Classic Example:</strong> Using <code>createRook</code> to
          create a simple global store. All components can access and modify the
          shared state.
        </div>

        <UserManager />
        <TrafficLight />
        <Counter />
        <StoreDisplay />
      </div>
    </Rook>
  );
};

export default ClassicExample;
