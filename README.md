# React Rooks

![React Rooks Logo](docs/rook-logo.svg)

> **React Rooks is a lightweight state management library for React that brings the simplicity of `useState` to global and contextual state. Just like a chess rook moves in straight lines, your state updates are direct, predictable, and powerful.**

[![npm version](https://badge.fury.io/js/react-rooks.svg)](https://badge.fury.io/js/react-rooks)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Why Choose React Rooks?

**If you love `useState` but need global state**, React Rooks is for you. It's designed to feel exactly like React's built-in hooks while providing powerful state management capabilities.

### ✨ Key Benefits

- **🪶 Ultra Lightweight**: No runtime dependencies (except optional Zod for validation)
- **🎣 Hook-First Design**: Feels exactly like `useState` but for global state
- **🔒 Type-Safe**: Full TypeScript support with automatic type inference
- **⚡ Zero Boilerplate**: No actions, reducers, or selectors required
- **🧩 Flexible**: Global stores, scoped stores, multiple stores, validation
- **📦 Tree-Shakable**: Only bundle what you use

---

## 📊 How React Rooks Compares

| Feature                | React Rooks  | Redux Toolkit | Zustand     | Jotai        | Valtio       |
| ---------------------- | ------------ | ------------- | ----------- | ------------ | ------------ |
| **Bundle Size**        | ~2KB         | ~47KB         | ~8KB        | ~13KB        | ~14KB        |
| **useState-like API**  | ✅ Perfect   | ❌ Complex    | ✅ Good     | ✅ Good      | ⚠️ Different |
| **TypeScript Support** | ✅ Excellent | ✅ Good       | ✅ Good     | ✅ Excellent | ✅ Good      |
| **Zero Boilerplate**   | ✅           | ❌            | ✅          | ✅           | ✅           |
| **Multiple Stores**    | ✅           | ✅            | ✅          | ✅           | ✅           |
| **Scoped Providers**   | ✅           | ❌            | ⚠️ Manual   | ✅           | ⚠️ Manual    |
| **Schema Validation**  | ✅ Zod       | ❌            | ❌          | ❌           | ❌           |
| **Reducers**           | ✅ Optional  | ✅ Required   | ✅ Optional | ✅           | ❌           |
| **DevTools**           | 🔄 Coming    | ✅            | ✅          | ✅           | ✅           |

---

## 🚀 Quick Start

### Installation

```bash
npm install react-rooks
# Optional: for validation features
npm install zod
```

### Basic Usage (Global Store)

```tsx
import { createRook } from "react-rooks";

// 1. Create your store (like useState but global)
export const [UserStore, useUser] = createRook({
  name: "John Doe",
  email: "john@example.com",
  theme: "light" as "light" | "dark",
});

// 2. Use anywhere in your app
function UserProfile() {
  const [name, setName] = useUser("name");
  const [email, setEmail] = useUser("email");

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
  );
}

// 3. Wrap your app
function App() {
  return (
    <UserStore>
      <UserProfile />
    </UserStore>
  );
}
```

---

## 🎯 useState vs useRook

React Rooks is designed to feel **exactly** like `useState`:

| **useState (React)**                    | **useRook (React Rooks)**                    |
| --------------------------------------- | -------------------------------------------- |
| `const [count, setCount] = useState(0)` | `const [count, setCount] = useRook("count")` |
| Component-scoped                        | Global/contextual scope                      |
| Direct updates                          | Direct updates                               |
| Type-safe                               | Type-safe                                    |
| Simple API                              | Simple API                                   |

### Migration is Easy

```tsx
// Before: Component state
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}

// After: Global state (same API!)
const [CounterStore, useCounter] = createRook({ count: 0 });

function Counter() {
  const [count, setCount] = useCounter("count");
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

---

## 📋 Complete API Reference

### `createRook(initialStore, reducers?)`

Creates a global store with optional reducers.

```tsx
import { createRook } from "react-rooks";

// Basic store
const [Store, useStore] = createRook({
  count: 0,
  user: { name: "", email: "" },
});

// With reducers
const [Store, useStore] = createRook(
  { count: 0 },
  {
    count: (state, action) => {
      switch (action.type) {
        case "increment":
          return state + 1;
        case "decrement":
          return state - 1;
        default:
          return state;
      }
    },
  }
);
```

### `createRookWithInit(initFunction, reducers?)`

Creates a store with lazy initialization.

```tsx
const [Store, useStore] = createRookWithInit(() => ({
  user: JSON.parse(localStorage.getItem("user") || "{}"),
  settings: loadUserSettings(),
}));
```

### `createZodRook(options)`

Creates a store with Zod schema validation.

```tsx
import { createZodRook } from "react-rooks";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "Must be 18+").default(18),
});

const [UserStore, useUser] = createZodRook({
  schema: UserSchema,
  onValidationError: (error) => {
    console.error("Validation failed:", error.errors);
  },
});

// Usage with automatic validation
function UserForm() {
  const [user, setUser] = useUser();

  // This will validate automatically
  const updateUser = (newUser) => {
    setUser(newUser); // Throws if validation fails
  };
}
```

### `useRook(key?)`

Hook to access store values.

```tsx
// Access specific key
const [count, setCount] = useRook("count");

// Access entire store
const [store, setStore] = useRook();

// Functional updates
setCount((prevCount) => prevCount + 1);

// Direct updates
setCount(42);
```

### `RookContainer`

Combine multiple stores.

```tsx
import { RookContainer } from "react-rooks";

const [UserStore] = createRook({ name: "" });
const [ThemeStore] = createRook({ mode: "light" });

function App() {
  return (
    <RookContainer rooks={[UserStore, ThemeStore]}>
      <MyApp />
    </RookContainer>
  );
}
```

**⚠️ Order Matters**: Stores are nested from top to bottom. Components lower in the tree can access stores from higher levels.

```tsx
// ✅ Correct: CartStore can access UserStore and ThemeStore
<RookContainer rooks={[UserStore, ThemeStore, CartStore]}>
  <App />
</RookContainer>

// ❌ Wrong: UserStore can't access CartStore or ThemeStore
<RookContainer rooks={[CartStore, ThemeStore, UserStore]}>
  <App />
</RookContainer>
```

---

## 🔥 Real-World Examples

### E-commerce Cart

```tsx
import { createRook } from "react-rooks";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const [CartStore, useCart] = createRook({
  items: [] as CartItem[],
  total: 0,
  isOpen: false,
});

function CartButton() {
  const [items, setItems] = useCart("items");
  const [isOpen, setIsOpen] = useCart("isOpen");

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  return (
    <button onClick={() => setIsOpen(!isOpen)}>Cart ({items.length})</button>
  );
}
```

### Authentication State

```tsx
import { createZodRook } from "react-rooks";
import { z } from "zod";

const AuthSchema = z.object({
  user: z
    .object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
    })
    .nullable(),
  isAuthenticated: z.boolean().default(false),
  token: z.string().nullable().default(null),
});

const [AuthStore, useAuth] = createZodRook({
  schema: AuthSchema,
  onValidationError: (error) => {
    console.error("Auth state validation failed:", error);
  },
});

function useAuthActions() {
  const [, setUser] = useAuth("user");
  const [, setToken] = useAuth("token");
  const [, setIsAuthenticated] = useAuth("isAuthenticated");

  const login = async (email: string, password: string) => {
    const { user, token } = await api.login(email, password);
    setUser(user);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return { login, logout };
}
```

### Theme Management

```tsx
const [ThemeStore, useTheme] = createRook({
  mode: "light" as "light" | "dark",
  primaryColor: "#007bff",
  fontSize: 16,
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
    document.documentElement.style.setProperty(
      "--font-size",
      `${theme.fontSize}px`
    );
    document.documentElement.className = theme.mode;
  }, [theme]);

  return <>{children}</>;
}

function ThemeToggle() {
  const [mode, setMode] = useTheme("mode");

  return (
    <button onClick={() => setMode(mode === "light" ? "dark" : "light")}>
      {mode === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

---

## 🔄 Migration Guides

### From Redux

```tsx
// Redux
const store = createStore(reducer);
const mapStateToProps = (state) => ({ count: state.count });
const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({ type: "INCREMENT" }),
});

// React Rooks
const [CounterStore, useCounter] = createRook({ count: 0 });

function Counter() {
  const [count, setCount] = useCounter("count");
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

### From Zustand

```tsx
// Zustand
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// React Rooks
const [Store, useStore] = createRook({ count: 0 });

function Counter() {
  const [count, setCount] = useStore("count");
  const increment = () => setCount((c) => c + 1);

  return <button onClick={increment}>{count}</button>;
}
```

### From Context + useState

```tsx
// Context + useState
const CounterContext = createContext();

function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      {children}
    </CounterContext.Provider>
  );
}

// React Rooks
const [CounterStore, useCounter] = createRook({ count: 0 });

function App() {
  return (
    <CounterStore>
      <Counter />
    </CounterStore>
  );
}
```

---

## 🏗️ Advanced Features

### Multiple Stores with Scoping

```tsx
// Create separate stores for different domains
const [UserStore, useUser] = createRook({
  defaultStore: {
    profile: { name: "", email: "" },
    preferences: { theme: "light", notifications: true },
  },
});

const [CartStore, useCart] = createRook({
  defaultStore: {
    items: [],
    total: 0,
  },
});

// Use them together
function App() {
  return (
    <RookContainer rooks={[UserStore, CartStore]}>
      <Header />
      <MainContent />
      <Footer />
    </RookContainer>
  );
}

// Or scope them to specific parts of your app
function UserSection() {
  return (
    <UserStore>
      <UserProfile />
      <UserSettings />
    </UserStore>
  );
}
```

### 🔗 Store Order and Dependencies

**The order of stores in `RookContainer` is crucial!** Stores are nested from top to bottom, so components can only access stores that are positioned above them in the array.

```tsx
// 🏪 Three stores with different responsibilities
const [UserStore, useUser] = createRook({
  defaultStore: {
    user: { id: 1, name: "Alice", role: "admin" },
    isLoggedIn: true,
  },
});

const [ThemeStore, useTheme] = createRook({
  defaultStore: {
    mode: "light" as "light" | "dark",
    primaryColor: "#3b82f6",
  },
});

const [CartStore, useCart] = createRook({
  defaultStore: {
    items: [] as CartItem[],
    total: 0,
  },
});

// Component that consumes from multiple stores
function SmartCartManager() {
  // ✅ Can access UserStore (positioned above)
  const [user] = useUser("user");
  const [isLoggedIn] = useUser("isLoggedIn");

  // ✅ Can access ThemeStore (positioned above)
  const [mode] = useTheme("mode");

  // ✅ Can access CartStore (same level)
  const [items, setItems] = useCart("items");

  const addItem = () => {
    if (!isLoggedIn) {
      alert(`${user.name}, please log in first!`);
      return;
    }

    const newItem = {
      id: Date.now(),
      name: `Item ${items.length + 1}`,
      price: 29.99,
      quantity: 1,
    };

    setItems([...items, newItem]);
  };

  return (
    <div
      style={{
        backgroundColor: mode === "dark" ? "#1f2937" : "#f9fafb",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>🛒 Cart for {user.name}</h3>
      <p>Theme: {mode} mode</p>
      <button onClick={addItem} disabled={!isLoggedIn}>
        Add Item to Cart
      </button>
      <p>Items in cart: {items.length}</p>
    </div>
  );
}

// ✅ CORRECT: Proper order allows SmartCartManager to access all stores
function CorrectApp() {
  return (
    <RookContainer rooks={[UserStore, ThemeStore, CartStore]}>
      <SmartCartManager />
    </RookContainer>
  );
}

// ❌ WRONG: CartStore is first, so SmartCartManager can't access UserStore/ThemeStore
function WrongApp() {
  return (
    <RookContainer rooks={[CartStore, UserStore, ThemeStore]}>
      <SmartCartManager /> {/* This will throw errors! */}
    </RookContainer>
  );
}
```

### 💡 RookContainer Best Practices

1. **Order by Dependency**: Place stores that others depend on first
2. **Logical Hierarchy**: User → Theme → Feature-specific stores
3. **Scope Appropriately**: Only include stores that components actually need

```tsx
// 📊 Recommended order patterns:

// For E-commerce app:
<RookContainer rooks={[
  AuthStore,      // 1. Authentication (most fundamental)
  ThemeStore,     // 2. UI preferences
  UserStore,      // 3. User data
  CartStore,      // 4. Shopping functionality
  CheckoutStore   // 5. Specific features
]}>

// For Admin dashboard:
<RookContainer rooks={[
  AuthStore,      // 1. Who is logged in?
  PermissionStore,// 2. What can they do?
  ThemeStore,     // 3. How does it look?
  DataStore       // 4. Application data
]}>

// For Blog:
<RookContainer rooks={[
  UserStore,      // 1. Reader preferences
  ThemeStore,     // 2. Display settings
  PostStore,      // 3. Content data
  CommentStore    // 4. Interactive features
]}>
```

### Custom Reducers

```tsx
const [TodoStore, useTodos] = createRook(
  {
    todos: [],
    filter: "all",
  },
  {
    todos: (state, action) => {
      switch (action.type) {
        case "ADD_TODO":
          return [...state, { id: Date.now(), text: action.text, done: false }];
        case "TOGGLE_TODO":
          return state.map((todo) =>
            todo.id === action.id ? { ...todo, done: !todo.done } : todo
          );
        case "DELETE_TODO":
          return state.filter((todo) => todo.id !== action.id);
        default:
          return state;
      }
    },
  }
);

function TodoList() {
  const [todos, dispatch] = useTodos("todos");

  const addTodo = (text: string) => {
    dispatch({ type: "ADD_TODO", text });
  };

  const toggleTodo = (id: number) => {
    dispatch({ type: "TOGGLE_TODO", id });
  };
}
```

### Server-Side Rendering (SSR)

```tsx
import { createRookWithInit } from "react-rooks";

// Initialize with server data
const [AppStore, useApp] = createRookWithInit(() => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  theme:
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light",
}));

// Hydrate on client
function App({ initialData }: { initialData?: any }) {
  return (
    <AppStore initialValue={initialData}>
      <MyApp />
    </AppStore>
  );
}
```

---

## 🎭 Philosophy: The Chess Rook

```
      ____
     |    |
     |____|
     |    |
     |____|
     |    |
    /|____|\
   /_|____|_\
     |    |
     |____|
      /  \
     /____\

   [  DATA  ]
```

Just like a rook in chess, React Rooks represents:

- **🏰 Centralized Power**: A strong, reliable foundation for your state
- **📐 Straight Lines**: Direct, predictable state updates (no magic)
- **♟️ Strategic Position**: Can be placed anywhere in your component tree
- **🔒 Defensive**: Type-safe and validated data protection
- **⚡ Fast Movement**: Instant updates across your entire application

The rook doesn't move in complex patterns—it's straightforward, powerful, and reliable. That's exactly how your state management should be.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/your-username/react-rooks.git
cd react-rooks
npm install
npm run dev
```

---

## 📄 License

MIT © [Your Name](https://github.com/your-username)

---

## 🙏 Acknowledgments

- Inspired by React's `useState` hook
- Built with TypeScript for type safety
- Uses Zod for runtime validation
- Chess rook metaphor for clear mental model

---

**Ready to move your state in straight lines? Start with React Rooks today! 🏰**
