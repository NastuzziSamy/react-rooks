import { createZodRook } from "../../../index-zod";
import { z } from "zod";
import CodeTooltip from "../components/CodeTooltip";

// Schéma avec valeurs par défaut uniquement
const TestSchema = z.object({
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

// Créer le Rook - SANS defaultStore, utilise uniquement les valeurs par défaut du schéma !
const [TestRook, useTest] = createZodRook({
  schema: TestSchema,
  onValidationError: (error) => {
    console.error("Validation error:", error.errors);
  },
});

const TestComponent = () => {
  const [store] = useTest();
  const [title, setTitle] = useTest("title");
  const [count, setCount] = useTest("count");
  const [theme, setTheme] = useTest("theme");

  const defaultValuesCodeTooltip = `// Zod Schema with default values
const TestSchema = z.object({
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

// Create Rook WITHOUT defaultStore - uses schema defaults only!
const [TestRook, useTest] = createZodRook({
  schema: TestSchema,
  onValidationError: (error) => {
    console.error("Validation error:", error.errors);
  },
});

// All default values come from Zod schema .default() methods
const TestComponent = () => {
  const [store] = useTest(); // Full store with defaults
  const [title, setTitle] = useTest("title"); // "My App"
  const [count, setCount] = useTest("count"); // 0
  
  return <div>Title: {title}, Count: {count}</div>;
};`;

  return (
    <div className="example-demo">
      <div className="demo-info">
        <strong>Test des valeurs par défaut:</strong> Ce store a été créé
        UNIQUEMENT avec les valeurs par défaut définies dans le schéma Zod,
        aucun `defaultStore` n'a été fourni !
      </div>

      <div className="demo-section">
        <h3>🎯 Store actuel (valeurs par défaut automatiques)</h3>
        <CodeTooltip code={defaultValuesCodeTooltip} />
        <div className="demo-state">
          <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(store, null, 2)}
          </pre>
        </div>
      </div>

      <div className="demo-section">
        <h3>✏️ Modifier les valeurs</h3>
        <CodeTooltip
          code={`// Modifying Zod validated values
const ModifyComponent = () => {
  const [title, setTitle] = useTest("title");
  const [count, setCount] = useTest("count");
  const [theme, setTheme] = useTest("theme");
  
  // All modifications are validated against Zod schema
  const handleTitleChange = (e) => {
    setTitle(e.target.value); // Validated as string
  };
  
  const handleCountChange = (e) => {
    setCount(parseInt(e.target.value) || 0); // Validated as number
  };
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme); // Validated as "light" | "dark"
  };
  
  return (
    <div>
      <input value={title} onChange={handleTitleChange} />
      <input type="number" value={count} onChange={handleCountChange} />
      <button onClick={() => handleThemeChange("dark")}>Dark Theme</button>
    </div>
  );
};`}
        />

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <strong>Title:</strong>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <strong>Count:</strong>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
              style={{
                marginLeft: "10px",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <strong>Theme:</strong>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              style={{
                marginLeft: "10px",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </div>

      <div className="demo-info">
        <p>
          <strong>✅ Valeurs par défaut utilisées automatiquement:</strong>
        </p>
        <ul style={{ textAlign: "left", margin: "0.5rem 0" }}>
          <li>title: "{store.title}" ← default("My App")</li>
          <li>count: {store.count} ← default(0)</li>
          <li>isActive: {store.isActive.toString()} ← default(true)</li>
          <li>theme: "{store.theme}" ← default("light")</li>
          <li>user.name: "{store.user.name}" ← default("Anonymous")</li>
          <li>
            user.email: "{store.user.email}" ← default("user@example.com")
          </li>
        </ul>
      </div>

      <div className="demo-info">
        🛠️ <strong>Schéma utilisé (avec valeurs par défaut):</strong>
        <pre
          style={{ fontSize: "0.8rem", marginTop: "0.5rem", textAlign: "left" }}
        >
          {`z.object({
  title: z.string().default("My App"),
  count: z.number().default(0),
  isActive: z.boolean().default(true),
  theme: z.enum(["light", "dark"]).default("light"),
  user: z.object({
    name: z.string().default("Anonymous"),
    email: z.string().email().default("user@example.com"),
    preferences: z.object({
      notifications: z.boolean().default(true),
      language: z.string().default("en")
    })
  })
})`}
        </pre>
      </div>
    </div>
  );
};

const DefaultValuesExample = () => {
  return (
    <TestRook>
      <TestComponent />
    </TestRook>
  );
};

export default DefaultValuesExample;
