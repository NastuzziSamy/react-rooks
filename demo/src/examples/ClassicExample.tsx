import React from "react";
import { useEffect } from "react";
import { createStoreRook } from "react-rooks";
import CodeTooltip from "../components/CodeTooltip";
type LightColor = "green" | "orange" | "red";

// Global store with createStoreRook
const [Rook, useRook] = createStoreRook({
  user: null as { id: number; name: string } | null,
  lightColor: "green" as LightColor,
  timestamp: null as string | null,
  counter: 0,
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
    setUser((prev) => (prev ? { ...prev, name: "Jane Doe" } : null));
  };

  const codeTooltip = `const [user, setUser] = useRook("user");

// Login user
setUser({ id: Date.now(), name: "John Doe" });

// Logout user  
setUser(null);

// Update user with function
setUser((prev) => prev ? { ...prev, name: "Jane Doe" } : null);`;

  return (
    <div className="demo-section">
      <h3>👤 User Management</h3>
      <CodeTooltip code={codeTooltip} />
      <div className="demo-controls">
        <button
          className={"demo-button" + (user ? " secondary" : "")}
          onClick={loginUser}
        >
          Login
        </button>
        <button
          className={"demo-button" + (user ? "" : " secondary")}
          onClick={logoutUser}
        >
          Logout
        </button>
        <button
          className={"demo-button" + (user ? "" : " secondary")}
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
  const [timestamp, setTimestamp] = useRook("timestamp");

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

  const codeTooltip = `const [light, setLight] = useRook("lightColor");
const [timestamp, setTimestamp] = useRook("timestamp");

// Auto-update with useEffect
useEffect(() => {
  const timer = setTimeout(() => {
    setTimestamp(new Date().toLocaleTimeString());
    setLight((prev) => {
      if (prev === "green") return "orange";
      if (prev === "orange") return "red";
      return "green";
    });
  }, 2000);
  return () => clearTimeout(timer);
}, [light]);

// Force update
setLight("green");
setTimestamp(new Date().toLocaleTimeString());`;

  return (
    <div className="demo-section">
      <h3>🚦 Traffic Light</h3>
      <CodeTooltip code={codeTooltip} />
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
      <div className="demo-state">Current state: {light}</div>
      <div className="demo-state">Last change: {timestamp}</div>
      <div className="demo-info">
        💡 The light changes automatically every 2 seconds. Click on a light to
        force the state.
      </div>
    </div>
  );
};

const useCounterReducer = () => {
  const [counter, setCounter] = useRook("counter");

  const reducer = (action: "increment" | "decrement" | "reset") => {
    switch (action) {
      case "increment":
        setCounter((prev) => prev + 1);
        break;
      case "decrement":
        setCounter((prev) => prev - 1);
        break;
      case "reset":
        setCounter(0);
        break;
      default:
        break;
    }
  };

  return [counter, reducer] as const;
};

const Counter = () => {
  const [counter, reducer] = useCounterReducer();

  const increment = () => reducer("increment");
  const decrement = () => reducer("decrement");
  const reset = () => reducer("reset");

  const codeTooltip = `const useCounterReducer = () => {
  const [counter, setCounter] = useRook("counter");
  
  const reducer = (action: "increment" | "decrement" | "reset") => {
    switch (action) {
      case "increment":
        setCounter((prev) => prev + 1);
        break;
      case "decrement":
        setCounter((prev) => prev - 1);
        break;
      case "reset":
        setCounter(0);
        break;
    }
  };
  
  return [counter, reducer] as const;
};

// Usage
const [counter, reducer] = useCounterReducer();
reducer("increment");`;

  return (
    <div className="demo-section">
      <h3>🔢 Global Counter actions</h3>
      <CodeTooltip code={codeTooltip} />
      <div className="demo-controls">
        <button className="demo-button" onClick={increment}>
          INCREMENT
        </button>
        <button className="demo-button" onClick={decrement}>
          DECREMENT
        </button>
        <button className="demo-button secondary" onClick={reset}>
          RESET
        </button>
      </div>
      <div className="demo-state">Counter: {counter}</div>
    </div>
  );
};

const StoreDisplay = () => {
  const [store] = useRook();

  const storeDisplayCodeTooltip = `// Accessing the entire store state
const StoreDisplay = () => {
  const [store] = useRook(); // Get the whole store
  
  return (
    <div>
      {JSON.stringify(store, null, 2)}
    </div>
  );
};

// The store contains all state:
// {
//   "user": { "id": 1, "name": "Alice", "role": "admin" },
//   "lightColor": "green",
//   "timestamp": "2024-01-15T10:30:00.000Z",
//   "counter": 5
// }`;

  return (
    <div className="demo-section">
      <h3>📊 Complete Store State</h3>
      <CodeTooltip code={storeDisplayCodeTooltip} />
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
