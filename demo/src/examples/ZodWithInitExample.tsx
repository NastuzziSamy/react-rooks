import React from "react";
import { createZodRook } from "../../../index-zod";
import { z } from "zod";

// Schéma Zod pour un utilisateur avec quelques champs sans valeurs par défaut
const UserSchema = z.object({
  id: z.string(), // Pas de valeur par défaut - sera fournie par init
  name: z.string().default(""),
  email: z.string().email().default(""),
  age: z.number().min(0).max(120).default(0),
  isActive: z.boolean().default(true),
  preferences: z
    .object({
      theme: z.enum(["light", "dark"]).default("light"),
      notifications: z.boolean().default(true),
    })
    .default({
      theme: "light" as const,
      notifications: true,
    }),
});

// Création du Rook (sans init function pour l'instant)
const [UserRook, useUser] = createZodRook({
  schema: UserSchema,
  onValidationError: (error) => console.error("Validation failed:", error),
  // Note: init function n'est pas encore supporté dans cette version
});

const ZodWithInitExample: React.FC = () => {
  const [user, updateUser] = useUser();

  return (
    <UserRook>
      <div className="p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Zod avec Init Function</h2>
        <div className="space-y-4">
          <div>
            <strong>ID:</strong> {user.id}
          </div>
          <div>
            <label className="block">
              <strong>Nom:</strong>
              <input
                type="text"
                value={user.name}
                onChange={(e) => updateUser({ name: e.target.value })}
                className="ml-2 px-2 py-1 border rounded"
              />
            </label>
          </div>
          <div>
            <label className="block">
              <strong>Email:</strong>
              <input
                type="email"
                value={user.email}
                onChange={(e) => updateUser({ email: e.target.value })}
                className="ml-2 px-2 py-1 border rounded"
              />
            </label>
          </div>
          <div>
            <label className="block">
              <strong>Âge:</strong>
              <input
                type="number"
                value={user.age}
                min="0"
                max="120"
                onChange={(e) =>
                  updateUser({ age: parseInt(e.target.value) || 0 })
                }
                className="ml-2 px-2 py-1 border rounded w-20"
              />
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={user.isActive}
                onChange={(e) => updateUser({ isActive: e.target.checked })}
                className="mr-2"
              />
              <strong>Actif</strong>
            </label>
          </div>
          <div>
            <strong>Préférences:</strong>
            <div className="ml-4 space-y-2">
              <label className="block">
                <strong>Thème:</strong>
                <select
                  value={user.preferences.theme}
                  onChange={(e) =>
                    updateUser({
                      preferences: {
                        ...user.preferences,
                        theme: e.target.value as "light" | "dark",
                      },
                    })
                  }
                  className="ml-2 px-2 py-1 border rounded"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                </select>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={user.preferences.notifications}
                  onChange={(e) =>
                    updateUser({
                      preferences: {
                        ...user.preferences,
                        notifications: e.target.checked,
                      },
                    })
                  }
                  className="mr-2"
                />
                <strong>Notifications</strong>
              </label>
            </div>
          </div>
        </div>
      </div>
    </UserRook>
  );
};

export default ZodWithInitExample;
