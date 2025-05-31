import React, { useState } from "react";
import { createZodRook } from "../../../index-zod";
import { z } from "zod";

// Schéma Zod pour notre store
const AppStoreSchema = z.object({
  user: z
    .object({
      id: z.string().min(1, "ID is required"),
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email format"),
      age: z
        .number()
        .min(0, "Age must be positive")
        .max(120, "Age must be realistic"),
    })
    .optional(),
  theme: z.enum(["light", "dark"]).default("light"),
  locale: z.enum(["en", "fr"]).default("en"),
  settings: z.object({
    notifications: z.boolean().default(true),
    autoSave: z.boolean().default(false),
    maxItems: z.number().min(1).max(100).default(10),
  }),
  items: z.array(z.string().min(1, "Item cannot be empty")).default([]),
});

// Créer le Rook avec validation Zod automatique
const [AppRook, useAppStore] = createZodRook({
  schema: AppStoreSchema,
  onValidationError: (error) => {
    console.error("Zod validation error:", error.errors);
  },
  strict: false, // En mode non-strict pour permettre les mises à jour même avec erreurs
});

const UserForm = () => {
  const [user, setUser] = useAppStore("user");
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

      // La validation sera automatiquement effectuée par createZodRook
      setUser(userData);
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
      <h3>👤 User Form (Auto Zod Validation)</h3>

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
            Save User (Auto Validated)
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

const ThemeManager = () => {
  const [theme, setTheme] = useAppStore("theme");
  const [locale, setLocale] = useAppStore("locale");

  return (
    <div className="demo-section">
      <h3>🎨 Theme & Locale (Enum Validation)</h3>

      <div className="demo-controls">
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

        <div className="locale-buttons">
          <button
            className={`locale-button ${locale === "en" ? "active" : ""}`}
            onClick={() => setLocale("en")}
          >
            English
          </button>
          <button
            className={`locale-button ${locale === "fr" ? "active" : ""}`}
            onClick={() => setLocale("fr")}
          >
            Français
          </button>
        </div>
      </div>

      <div className="demo-state">
        Theme: {theme}
        <br />
        Locale: {locale?.toUpperCase()}
      </div>
    </div>
  );
};

const ItemsManager = () => {
  const [items, setItems] = useAppStore("items");
  const [settings] = useAppStore("settings");
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");

  const addItem = () => {
    if (!newItem.trim()) {
      setError("Item cannot be empty");
      return;
    }

    if (items.length >= settings.maxItems) {
      setError(`Maximum ${settings.maxItems} items allowed`);
      return;
    }

    try {
      // La validation Zod sera automatiquement appliquée
      setItems((prev: string[]) => [...prev, newItem.trim()]);
      setNewItem("");
      setError("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  const removeItem = (index: number) => {
    setItems((prev: string[]) =>
      prev.filter((_: string, i: number) => i !== index)
    );
  };

  const testInvalidItem = () => {
    // Test : essayer d'ajouter un item vide (devrait être rejeté par Zod)
    try {
      setItems((prev: string[]) => [...prev, ""]);
    } catch (err) {
      console.log("Expected validation error:", err);
    }
  };

  return (
    <div className="demo-section">
      <h3>📝 Items List (Array Validation)</h3>

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <input
            type="text"
            placeholder="New item (min 1 char)"
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
          <button
            className="demo-button secondary"
            onClick={() => setItems([])}
          >
            Clear All
          </button>
          <button
            className="demo-button"
            onClick={testInvalidItem}
            style={{ background: "#fed7d7" }}
          >
            Test Invalid Item
          </button>
        </div>

        {error && (
          <div className="error-display" style={{ marginTop: "0.5rem" }}>
            {error}
          </div>
        )}
      </div>

      <div className="demo-state">
        Items ({items?.length}/{settings?.maxItems}):
        {items?.length > 0 ? (
          <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1rem" }}>
            {items?.map((item: string, idx: number) => (
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

const StoreDebugger = () => {
  const [store] = useAppStore();

  return (
    <div className="demo-section">
      <h3>🔍 Store Debugger (Full State)</h3>
      <div className="demo-state">
        <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>
          {JSON.stringify(store, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const ZodRookExample = () => {
  return (
    <AppRook>
      <div className="example-demo">
        <div className="demo-info">
          <strong>createZodRook Example:</strong> Automatic validation using Zod
          schemas. All store updates are validated in real-time with the defined
          schema. Type safety and runtime validation combined!
        </div>

        <UserForm />
        <ThemeManager />
        <ItemsManager />
        <StoreDebugger />

        <div className="demo-info">
          💡 Open the browser console to see validation logs when invalid data
          is attempted!
        </div>

        <div className="demo-info">
          🛠️ <strong>Schema Used:</strong>
          <pre style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            {`z.object({
  user: z.object({
    id: z.string().min(1),
    name: z.string().min(2),
    email: z.string().email(),
    age: z.number().min(0).max(120)
  }).optional(),
  theme: z.enum(["light", "dark"]),
  locale: z.enum(["en", "fr"]),
  settings: z.object({
    notifications: z.boolean(),
    autoSave: z.boolean(),
    maxItems: z.number().min(1).max(100)
  }),
  items: z.array(z.string().min(1))
})`}
          </pre>
        </div>
      </div>
    </AppRook>
  );
};

export default ZodRookExample;
