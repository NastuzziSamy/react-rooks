import { createStoreRook, RookContainer } from "react-rooks";
import CodeTooltip from "../components/CodeTooltip";

// 🏪 Store 1: User Management (highest level)
const [UserStore, useUser] = createStoreRook({
  user: { id: 1, name: "Alice", role: "admin" } as {
    id: number;
    name: string;
    role: string;
  },
  isLoggedIn: true,
});

// 🎨 Store 2: Theme Management (middle level)
const [ThemeStore, useTheme] = createStoreRook({
  mode: "light" as "light" | "dark",
  primaryColor: "#3b82f6",
});

// 🛒 Store 3: Shopping Cart (lowest level, depends on user)
const [CartStore, useCart] = createStoreRook({
  items: [] as {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[],
  total: 0,
  currency: "USD",
});

// Component that uses User store (highest level)
const UserInfo = () => {
  const [user, setUser] = useUser("user");
  const [isLoggedIn, setIsLoggedIn] = useUser("isLoggedIn");

  const userCodeTooltip = `// User Store Definition
const [UserStore, useUser] = createStoreRook({
  user: { id: 1, name: "Alice", role: "admin" },
  isLoggedIn: true,
});

// Usage in Component
const UserInfo = () => {
  const [user, setUser] = useUser("user");
  const [isLoggedIn, setIsLoggedIn] = useUser("isLoggedIn");
  
  return (
    <button onClick={() => setUser({...user, name: "Bob"})}>
      Switch User
    </button>
  );
};`;

  return (
    <div className="demo-section">
      <h3>👤 User Management</h3>
      <CodeTooltip code={userCodeTooltip} />
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
      <div className="demo-state">
        User: {user.name} ({user.role}) -{" "}
        {isLoggedIn ? "Logged In" : "Logged Out"}
      </div>
    </div>
  );
};

// Component that uses Theme store (middle level)
const ThemeControls = () => {
  const [mode, setMode] = useTheme("mode");
  const [primaryColor, setPrimaryColor] = useTheme("primaryColor");

  const themeCodeTooltip = `// Theme Store Definition
const [ThemeStore, useTheme] = createStoreRook({
  mode: "light" as "light" | "dark",
  primaryColor: "#3b82f6",
});

// Usage in Component
const ThemeControls = () => {
  const [mode, setMode] = useTheme("mode");
  const [primaryColor, setPrimaryColor] = useTheme("primaryColor");
  
  return (
    <button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
      Toggle Theme
    </button>
  );
};`;

  const resetTheme = () => {
    setMode("light");
    setPrimaryColor("#3b82f6");
  };

  return (
    <div className="demo-section">
      <h3>🎨 Theme Settings</h3>
      <CodeTooltip code={themeCodeTooltip} />
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
        <button className="demo-button secondary" onClick={resetTheme}>
          Reset
        </button>
      </div>
      <div className="demo-state">
        Mode: {mode} | Color: {primaryColor}
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

  const cartCodeTooltip = `// Cart Store Definition
const [CartStore, useCart] = createStoreRook({
  items: [],
  total: 0,
  currency: "USD",
});

// Multi-Store Consumer Component
const CartManager = () => {
  const [user] = useUser("user");        // From UserStore
  const [mode] = useTheme("mode");       // From ThemeStore
  const [items, setItems] = useCart("items"); // From CartStore
  
  // Can access all stores because it's nested inside RookContainer
  return <div>Cart for {user.name} in {mode} mode</div>;
};`;

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
    border: `2px solid ${primaryColor}`,
    borderRadius: "8px",
    padding: "1rem",
  };

  return (
    <div className="demo-section" style={cartStyle}>
      <h3>🛒 Shopping Cart (Multi-Store Consumer)</h3>
      <CodeTooltip code={cartCodeTooltip} />

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

      <div className="demo-state">
        Customer: {user.name} ({isLoggedIn ? "✅" : "❌"}) | Theme: {mode} |
        Items: {items.length} | Total: ${total.toFixed(2)}
      </div>

      {items.length > 0 && (
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          <strong>Cart Items:</strong>
          {items.map((item) => (
            <div key={item.id} style={{ marginLeft: "10px" }}>
              • {item.name} - ${item.price} x {item.quantity}
            </div>
          ))}
        </div>
      )}

      <div className="demo-info" style={{ marginTop: "15px" }}>
        💡 This component consumes data from all three stores above it!
      </div>
    </div>
  );
};

// Main example component
const RookContainerExample = () => {
  const rookContainerCodeTooltip = `// Store Order and RookContainer Usage
const [UserStore, useUser] = createStoreRook({...});
const [ThemeStore, useTheme] = createStoreRook({...});
const [CartStore, useCart] = createStoreRook({...});

// Order matters! Each store can access stores above it
<RookContainer rooks={[UserStore, ThemeStore, CartStore]}>
  <UserInfo />     {/* Can only use UserStore */}
  <ThemeControls /> {/* Can use UserStore + ThemeStore */}
  <CartManager />   {/* Can use ALL stores */}
</RookContainer>

// If order was [CartStore, ThemeStore, UserStore]:
// - UserStore could access CartStore + ThemeStore
// - ThemeStore could only access CartStore
// - CartStore would be independent`;

  return (
    <div className="example-demo">
      <div className="demo-info">
        <strong>RookContainer Example:</strong> Combine multiple stores with{" "}
        <code>RookContainer</code>. Using <code>createStoreRook</code> for
        cleaner syntax. The <strong>order matters</strong>: stores are nested
        from top to bottom, so lower components can consume from all stores
        above them.
      </div>

      {/* ⭐ The magic happens here! Order is crucial */}
      <RookContainer rooks={[UserStore, ThemeStore, CartStore]}>
        <UserInfo />
        <ThemeControls />
        <CartManager />

        <div className="demo-section">
          <h3>🔄 Store Order Explanation</h3>
          <CodeTooltip code={rookContainerCodeTooltip} />
          <div className="demo-state">
            <div style={{ fontFamily: "monospace", fontSize: "14px" }}>
              Order: [UserStore, ThemeStore, CartStore] →<br />
              CartStore can access UserStore + ThemeStore ✅<br />
              ThemeStore can access UserStore ✅<br />
              UserStore is independent 🔒
            </div>
          </div>
          <div className="demo-info">
            💡 If we put CartStore first, it couldn't access UserStore or
            ThemeStore! The order determines the nesting hierarchy.
          </div>
        </div>
      </RookContainer>
    </div>
  );
};

export default RookContainerExample;
