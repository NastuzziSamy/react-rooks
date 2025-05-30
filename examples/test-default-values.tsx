import React from "react";
import { createZodRook } from "../src/zod";
import { z } from "zod";

// Schéma avec valeurs par défaut uniquement
const AppSchema = z.object({
  title: z.string().default("My App"),
  count: z.number().default(0),
  isActive: z.boolean().default(true),
  theme: z.enum(["light", "dark"]).default("light"),
  user: z.object({
    name: z.string().default("Anonymous"),
    email: z.string().email().default("user@example.com"),
    preferences: z.object({
      notifications: z.boolean().default(true),
      language: z.string().default("en"),
    }),
  }),
});

// Créer le Rook - maintenant SANS defaultStore !
const [AppRook, useApp] = createZodRook({
  schema: AppSchema,
  onValidationError: (error) => {
    console.error("Validation error:", error.errors);
  },
});

const TestComponent = () => {
  const [store] = useApp();
  const [title, setTitle] = useApp("title");
  const [count, setCount] = useApp("count");
  const [theme, setTheme] = useApp("theme");

  React.useEffect(() => {
    console.log(
      "🎯 Store initial (devrait utiliser les valeurs par défaut du schéma):"
    );
    console.log(JSON.stringify(store, null, 2));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Test des valeurs par défaut Zod</h1>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3>Store actuel:</h3>
        <pre style={{ fontSize: "12px", overflow: "auto" }}>
          {JSON.stringify(store, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Title:</strong>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Count:</strong>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 0)}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Theme:</strong>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "light" | "dark")}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#e8f5e8",
          borderRadius: "4px",
        }}
      >
        <p>
          <strong>✅ Succès!</strong> Le store a été initialisé avec les valeurs
          par défaut du schéma Zod:
        </p>
        <ul>
          <li>title: "{store.title}" (default: "My App")</li>
          <li>count: {store.count} (default: 0)</li>
          <li>isActive: {store.isActive.toString()} (default: true)</li>
          <li>theme: "{store.theme}" (default: "light")</li>
          <li>user.name: "{store.user.name}" (default: "Anonymous")</li>
          <li>
            user.email: "{store.user.email}" (default: "user@example.com")
          </li>
        </ul>
      </div>
    </div>
  );
};

const TestDefaultValues = () => {
  return (
    <AppRook>
      <TestComponent />
    </AppRook>
  );
};

export default TestDefaultValues;
