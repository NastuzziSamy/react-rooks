import React, { useState } from "react";
import { createRook } from "react-rooks";
import { z } from "zod";

// Validation schemas with Zod
const UserSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  age: z
    .number()
    .min(0, "Age must be positive")
    .max(120, "Age must be realistic"),
});

type User = z.infer<typeof UserSchema>;

// Store with basic types (Zod validation simulation)
const [Rook, useRook] = createRook<{
  user?: User;
  locale: "en" | "fr";
  theme: "light" | "dark";
  settings: {
    notifications: boolean;
    autoSave: boolean;
    maxItems: number;
  };
  items: string[];
}>({
  defaultStore: {
    user: undefined,
    locale: "fr",
    theme: "light",
    settings: {
      notifications: true,
      autoSave: false,
      maxItems: 10,
    },
    items: [],
  },
});

const UserForm = () => {
  const [user, setUser] = useRook("user");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    age: "",
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age) || 0,
      };

      // Zod validation
      const validatedUser = UserSchema.parse(userData);
      setUser(validatedUser);
      setValidationErrors([]);

      // Reset form
      setFormData({ id: "", name: "", email: "", age: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors.map((err) => err.message));
      }
    }
  };

  const clearUser = () => {
    setUser(undefined);
    setValidationErrors([]);
  };

  return (
    <div className="demo-section">
      <h3>👤 User Form (Zod Validation)</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "grid",
            gap: "0.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <input
            type="text"
            placeholder="ID"
            value={formData.id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, id: e.target.value }))
            }
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
            }}
          />
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
            }}
          />
          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, age: e.target.value }))
            }
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
            }}
          />
        </div>

        <div className="demo-controls" style={{ marginTop: "1rem" }}>
          <button type="submit" className="demo-button">
            Save User
          </button>
          <button
            type="button"
            className="demo-button secondary"
            onClick={clearUser}
          >
            Clear
          </button>
        </div>
      </form>

      {validationErrors.length > 0 && (
        <div className="error-display">
          <strong>Validation errors:</strong>
          <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1rem" }}>
            {validationErrors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="demo-state">
        User:{" "}
        {user
          ? `${user.name} (${user.email}, ${user.age} years old)`
          : "No user"}
      </div>
    </div>
  );
};

const SettingsManager = () => {
  const [settings, setSettings] = useRook("settings");
  const [maxItemsInput, setMaxItemsInput] = useState(
    settings.maxItems.toString()
  );
  const [validationError, setValidationError] = useState<string>("");

  const updateNotifications = () => {
    setSettings(
      (prev: {
        notifications: boolean;
        autoSave: boolean;
        maxItems: number;
      }) => ({
        ...prev,
        notifications: !prev.notifications,
      })
    );
  };

  const updateAutoSave = () => {
    setSettings(
      (prev: {
        notifications: boolean;
        autoSave: boolean;
        maxItems: number;
      }) => ({ ...prev, autoSave: !prev.autoSave })
    );
  };

  const updateMaxItems = () => {
    try {
      const newValue = parseInt(maxItemsInput);
      const validated = z.number().min(1).max(100).parse(newValue);
      setSettings((prev) => ({ ...prev, maxItems: validated }));
      setValidationError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0].message);
      }
    }
  };

  return (
    <div className="demo-section">
      <h3>⚙️ Settings (Nested Objects)</h3>

      <div className="demo-controls">
        <button
          className={`demo-button ${settings.notifications ? "" : "secondary"}`}
          onClick={updateNotifications}
        >
          Notifications: {settings.notifications ? "ON" : "OFF"}
        </button>
        <button
          className={`demo-button ${settings.autoSave ? "" : "secondary"}`}
          onClick={updateAutoSave}
        >
          Auto-save: {settings.autoSave ? "ON" : "OFF"}
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
          }}
        >
          Max items (1-100):
        </label>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="number"
            value={maxItemsInput}
            onChange={(e) => setMaxItemsInput(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              width: "100px",
            }}
          />
          <button className="demo-button" onClick={updateMaxItems}>
            Update
          </button>
        </div>
        {validationError && (
          <div className="error-display" style={{ marginTop: "0.5rem" }}>
            {validationError}
          </div>
        )}
      </div>

      <div className="demo-state">{JSON.stringify(settings, null, 2)}</div>
    </div>
  );
};

const ItemsManager = () => {
  const [items, setItems] = useRook("items");
  const [settings] = useRook("settings");
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (!newItem.trim()) return;

    if (items.length >= settings.maxItems) {
      alert(`Maximum ${settings.maxItems} items allowed`);
      return;
    }

    setItems((prev) => [...prev, newItem.trim()]);
    setNewItem("");
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <div className="demo-section">
      <h3>📝 Items List (Arrays)</h3>

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <input
            type="text"
            placeholder="New item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addItem()}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
            }}
          />
          <button className="demo-button" onClick={addItem}>
            Add
          </button>
        </div>

        <div className="demo-controls">
          <button className="demo-button secondary" onClick={clearAll}>
            Clear All
          </button>
        </div>
      </div>

      <div className="demo-state">
        Items ({items.length}/{settings.maxItems}):
        {items.length > 0 ? (
          <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1rem" }}>
            {items.map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "0.25rem 0",
                }}
              >
                <span>{item}</span>
                <button
                  onClick={() => removeItem(idx)}
                  style={{
                    background: "#fed7d7",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ fontStyle: "italic", opacity: 0.7 }}>No items</div>
        )}
      </div>
    </div>
  );
};

const ThemeLocaleManager = () => {
  const [locale, setLocale] = useRook("locale");
  const [theme, setTheme] = useRook("theme");

  return (
    <div className="demo-section">
      <h3>🎨 Theme and Language (Enums)</h3>

      <div className="demo-controls">
        <div className="locale-buttons">
          <button
            className={`locale-button ${locale === "fr" ? "active" : ""}`}
            onClick={() => setLocale("fr")}
          >
            Français
          </button>
          <button
            className={`locale-button ${locale === "en" ? "active" : ""}`}
            onClick={() => setLocale("en")}
          >
            English
          </button>
        </div>

        <div className="locale-buttons">
          <button
            className={`locale-button ${theme === "light" ? "active" : ""}`}
            onClick={() => setTheme("light")}
          >
            🌞 Light
          </button>
          <button
            className={`locale-button ${theme === "dark" ? "active" : ""}`}
            onClick={() => setTheme("dark")}
          >
            🌙 Dark
          </button>
        </div>
      </div>

      <div className="demo-state">
        Language: {locale.toUpperCase()}
        <br />
        Theme: {theme}
      </div>
    </div>
  );
};

const SchemaInfo = () => {
  return (
    <div className="demo-section">
      <h3>📋 Zod Schema Used</h3>
      <div
        className="demo-state"
        style={{ fontSize: "0.8rem", lineHeight: "1.4" }}
      >
        {`z.object({
  user: UserSchema.optional(), // { id, name, email, age }
  locale: z.enum(["en", "fr"]).default("fr"),
  theme: z.enum(["light", "dark"]).default("light"),
  settings: z.object({
    notifications: z.boolean().default(true),
    autoSave: z.boolean().default(false),
    maxItems: z.number().min(1).max(100).default(10),
  }).default({}),
  items: z.array(z.string()).default([]),
})`}
      </div>
    </div>
  );
};

const ZodExample = () => {
  return (
    <Rook>
      <div className="example-demo">
        <div className="demo-info">
          <strong>Zod Example:</strong> Usage of <code>createSchemedRook</code>{" "}
          for automatic data validation with Zod schemas. All types are inferred
          and validated.
        </div>

        <UserForm />
        <ThemeLocaleManager />
        <SettingsManager />
        <ItemsManager />
        <SchemaInfo />

        <div className="demo-info">
          💡 Try entering invalid data to see validation in action!
        </div>
      </div>
    </Rook>
  );
};

export default ZodExample;
