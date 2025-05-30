import React from "react";
import { createZodRook } from "../src/zod";
import { z } from "zod";

// Schéma de validation pour un utilisateur
const UserSchema = z.object({
  id: z.string().uuid("ID must be a valid UUID"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  age: z
    .number()
    .min(18, "Must be at least 18")
    .max(100, "Age must be realistic"),
  isActive: z.boolean(),
  roles: z.array(z.enum(["admin", "user", "moderator"])),
  profile: z.object({
    bio: z.string().max(500, "Bio too long"),
    avatar: z.string().url("Invalid avatar URL").optional(),
  }),
});

// Créer le Rook avec validation automatique
const [UserRook, useUser] = createZodRook({
  schema: UserSchema,
  onValidationError: (error) => {
    console.error("User validation failed:", error.errors);
    // Optionnel : afficher des notifications à l'utilisateur
  },
  strict: false, // Permet les mises à jour même avec erreurs (avec warning)
});

// Composant pour afficher et modifier un utilisateur
const UserProfile = () => {
  const [user, setUser] = useUser();
  const [name, setName] = useUser("name");
  const [email, setEmail] = useUser("email");

  const createSampleUser = () => {
    // Cette mise à jour sera automatiquement validée
    setUser({
      id: crypto.randomUUID(),
      name: "Alice Johnson",
      email: "alice@example.com",
      age: 28,
      isActive: true,
      roles: ["user"],
      profile: {
        bio: "Software developer passionate about React and TypeScript",
        avatar: "https://example.com/avatar.jpg",
      },
    });
  };

  const testInvalidData = () => {
    // Cette mise à jour échouera en validation et sera loggée
    setUser({
      id: "invalid-id", // ❌ Pas un UUID valide
      name: "A", // ❌ Trop court
      email: "invalid-email", // ❌ Format email invalide
      age: 15, // ❌ Trop jeune
      isActive: true,
      roles: ["invalid-role" as any], // ❌ Rôle non autorisé
      profile: {
        bio: "x".repeat(600), // ❌ Bio trop longue
        avatar: "not-a-url", // ❌ URL invalide
      },
    });
  };

  const updateName = (newName: string) => {
    // Mise à jour d'un champ spécifique avec validation
    setName(newName);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>👤 User Profile (Zod Validation)</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={createSampleUser}
          style={{
            padding: "10px 15px",
            marginRight: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Valid User
        </button>
        <button
          onClick={testInvalidData}
          style={{
            padding: "10px 15px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Test Invalid Data
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          <strong>Name:</strong>
        </label>
        <input
          type="text"
          value={name || ""}
          onChange={(e) => updateName(e.target.value)}
          placeholder="Enter name (min 2 chars)"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          <strong>Email:</strong>
        </label>
        <input
          type="email"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      >
        <h3>Current User Data:</h3>
        <pre style={{ margin: 0, fontSize: "12px", overflow: "auto" }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>
          💡 <strong>Tips:</strong>
        </p>
        <ul>
          <li>All updates are automatically validated with the Zod schema</li>
          <li>Check the browser console to see validation messages</li>
          <li>Try entering invalid data to see validation in action</li>
          <li>
            The schema enforces UUID format, email validation, age limits, etc.
          </li>
        </ul>
      </div>
    </div>
  );
};

// Exemple d'utilisation avec gestion d'erreur stricte
const StrictUserExample = () => {
  // Version stricte qui lance des exceptions
  const [StrictUserRook, useStrictUser] = createZodRook({
    schema: UserSchema,
    strict: true,
    onValidationError: (error) => {
      alert(`Validation Error: ${error.errors[0].message}`);
    },
  });

  const StrictUserForm = () => {
    const [user, setUser] = useStrictUser();

    const handleStrictUpdate = () => {
      try {
        setUser({
          id: "not-a-uuid",
          name: "",
          email: "invalid",
          age: -5,
          isActive: true,
          roles: [],
          profile: { bio: "" },
        });
      } catch (error) {
        console.error("Strict validation prevented update:", error);
      }
    };

    return (
      <div
        style={{
          padding: "20px",
          border: "2px solid red",
          borderRadius: "4px",
        }}
      >
        <h3>🔒 Strict Mode Example</h3>
        <button onClick={handleStrictUpdate}>
          Try Invalid Update (Will Fail)
        </button>
        <pre style={{ fontSize: "12px", marginTop: "10px" }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <StrictUserRook>
      <StrictUserForm />
    </StrictUserRook>
  );
};

// Composant principal qui combine les exemples
const ZodRookExample = () => {
  return (
    <div>
      <UserRook>
        <UserProfile />
      </UserRook>

      <div style={{ marginTop: "40px" }}>
        <StrictUserExample />
      </div>
    </div>
  );
};

export default ZodRookExample;
