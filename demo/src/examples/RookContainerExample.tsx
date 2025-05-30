import React from "react";
import { createRook, RookContainer } from "react-rooks";

// 🏪 Store 1: User Management (highest level)
const [UserStore, useUser] = createRook({
  defaultStore: {
    user: { id: 1, name: "Alice", role: "admin" },
    isLoggedIn: true,
  },
});

// 🎨 Store 2: Theme Management (middle level)
const [ThemeStore, useTheme] = createRook({
  defaultStore: {
    mode: "light" as "light" | "dark",
    primaryColor: "#3b82f6",
    fontSize: 16,
  },
});

// 🛒 Store 3: Shopping Cart (lowest level, depends on user)
const [CartStore, useCart] = createRook({
  defaultStore: {
    items: [] as {
      id: number;
      name: string;
      price: number;
      quantity: number;
    }[],
    total: 0,
    currency: "USD",
  },
});

// Component that uses User store (highest level)
const UserInfo = () => {
  const [user, setUser] = useUser("user");
  const [isLoggedIn, setIsLoggedIn] = useUser("isLoggedIn");

  return (
    <div className="demo-section">
      <h4>👤 User Information</h4>
      <div className="demo-state">
        <p>
          <strong>Name:</strong> {user.name} ({user.role})
        </p>
        <p>
          <strong>Status:</strong> {isLoggedIn ? "Logged In" : "Logged Out"}
        </p>
      </div>
      <div className="demo-controls">
        <button
          className="demo-button"
          onClick={() =>
            setUser({ ...user, name: user.name === "Alice" ? "Bob" : "Alice" })
          }
        >
          Switch User
        </button>
        <button
          className="demo-button secondary"
          onClick={() => setIsLoggedIn(!isLoggedIn)}
        >
          Toggle Login
        </button>
      </div>
    </div>
  );
};

// Component that uses Theme store (middle level)
const ThemeControls = () => {
  const [mode, setMode] = useTheme("mode");
  const [primaryColor, setPrimaryColor] = useTheme("primaryColor");
  const [fontSize, setFontSize] = useTheme("fontSize");

  return (
    <div className="demo-section">
      <h4>🎨 Theme Settings</h4>
      <div className="demo-state">
        <p>
          <strong>Mode:</strong> {mode}
        </p>
        <p>
          <strong>Color:</strong> {primaryColor}
        </p>
        <p>
          <strong>Font Size:</strong> {fontSize}px
        </p>
      </div>
      <div className="demo-controls">
        <button
          className="demo-button"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
        >
          Toggle Theme
        </button>
        <button
          className="demo-button"
          onClick={() =>
            setPrimaryColor(primaryColor === "#3b82f6" ? "#ef4444" : "#3b82f6")
          }
        >
          Change Color
        </button>
        <button
          className="demo-button"
          onClick={() => setFontSize(fontSize === 16 ? 18 : 16)}
        >
          Font Size
        </button>
      </div>
    </div>
  );
};

// Component that consumes data from ALL stores (demonstrates order importance)
const CartManager = () => {
  const [user] = useUser("user"); // 🔼 Consumes from User store
  const [isLoggedIn] = useUser("isLoggedIn");
  const [mode] = useTheme("mode"); // 🔼 Consumes from Theme store
  const [primaryColor] = useTheme("primaryColor");
  const [items, setItems] = useCart("items");
  const [total, setTotal] = useCart("total");

  const addItem = () => {
    if (!isLoggedIn) {
      alert("Please log in to add items to cart!");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: `Item ${items.length + 1}`,
      price: Math.floor(Math.random() * 50) + 10,
      quantity: 1,
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    setTotal(
      newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    setTotal(0);
  };

  // This component demonstrates consuming from multiple stores
  const cartStyle = {
    backgroundColor: mode === "dark" ? "#1f2937" : "#f9fafb",
    borderColor: primaryColor,
    color: mode === "dark" ? "#f9fafb" : "#1f2937",
  };

  return (
    <div className="demo-section" style={cartStyle}>
      <h4>🛒 Shopping Cart (Multi-Store Consumer)</h4>

      <div className="demo-state">
        <p>
          <strong>Customer:</strong> {user.name} ({isLoggedIn ? "✅" : "❌"})
        </p>
        <p>
          <strong>Theme:</strong> {mode} mode
        </p>
        <p>
          <strong>Items:</strong> {items.length}
        </p>
        <p>
          <strong>Total:</strong> ${total.toFixed(2)}
        </p>
      </div>

      {items.length > 0 && (
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          {items.map((item) => (
            <div key={item.id} style={{ marginBottom: "5px" }}>
              {item.name} - ${item.price} x {item.quantity}
            </div>
          ))}
        </div>
      )}

      <div className="demo-controls">
        <button
          className="demo-button"
          onClick={addItem}
          disabled={!isLoggedIn}
          style={{ opacity: isLoggedIn ? 1 : 0.5 }}
        >
          Add Item
        </button>
        <button className="demo-button secondary" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div style={{ marginTop: "15px", fontSize: "12px", opacity: 0.7 }}>
        💡 This component consumes data from all three stores above it!
      </div>
    </div>
  );
};

// Main example component
const RookContainerExample = () => {
  return (
    <div className="demo-container">
      <h3>🏗️ RookContainer Example</h3>

      <div className="demo-explanation">
        <p>
          <strong>RookContainer</strong> allows you to combine multiple stores.
          The <strong>order matters</strong>: stores are nested from top to
          bottom, so lower components can consume from all stores above them.
        </p>

        <div
          style={{
            marginTop: "10px",
            fontSize: "14px",
            fontFamily: "monospace",
          }}
        >
          Order: [UserStore, ThemeStore, CartStore] →<br />
          CartStore can access UserStore + ThemeStore ✅<br />
          ThemeStore can access UserStore ✅<br />
          UserStore is independent 🔒
        </div>
      </div>

      {/* ⭐ The magic happens here! Order is crucial */}
      <RookContainer rooks={[UserStore, ThemeStore, CartStore]}>
        <UserInfo />
        <ThemeControls />
        <CartManager />

        <div className="demo-section">
          <h4>🔄 Wrong Order Example</h4>
          <p style={{ fontSize: "14px", color: "#ef4444" }}>
            If we put CartStore first: [CartStore, UserStore, ThemeStore]
            <br />→ CartStore couldn't access UserStore or ThemeStore! ❌
          </p>
          <p style={{ fontSize: "14px", color: "#10b981" }}>
            Current order: [UserStore, ThemeStore, CartStore]
            <br />→ CartStore can access both UserStore and ThemeStore! ✅
          </p>
        </div>
      </RookContainer>
    </div>
  );
};

export default RookContainerExample;
