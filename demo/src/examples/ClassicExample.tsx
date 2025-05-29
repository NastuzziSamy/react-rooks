import React, { useEffect } from "react";
import { createRook } from "react-rooks";

const Locale = {
  EN: "en",
  FR: "fr",
} as const;

// Global store with createRook
const [Rook, useRook] = createRook({
  defaultStore: {
    user: null as { id: number; name: string } | null,
    locale: Locale.EN,
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

const LocaleManager = () => {
  const [locale, setLocale] = useRook("locale");

  useEffect(() => {
    // Simulate automatic change after 5 seconds
    const timer = setTimeout(() => {
      setLocale(locale === Locale.EN ? Locale.FR : Locale.EN);
    }, 5000);

    return () => clearTimeout(timer);
  }, [locale, setLocale]);

  return (
    <div className="demo-section">
      <h3>🌍 Language</h3>
      <div className="demo-controls">
        <div className="locale-buttons">
          <button
            className={`locale-button ${locale === Locale.EN ? "active" : ""}`}
            onClick={() => setLocale(Locale.EN)}
          >
            EN
          </button>
          <button
            className={`locale-button ${locale === Locale.FR ? "active" : ""}`}
            onClick={() => setLocale(Locale.FR)}
          >
            FR
          </button>
        </div>
      </div>
      <div className="demo-state">Current language: {locale.toUpperCase()}</div>
      <div className="demo-info">
        💡 Language changes automatically every 5 seconds
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
        <LocaleManager />
        <Counter />
        <StoreDisplay />
      </div>
    </Rook>
  );
};

export default ClassicExample;
