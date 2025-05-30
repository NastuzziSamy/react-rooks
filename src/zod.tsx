import * as React from "react";
import { z } from "zod";

import Rook from "./rook";
import type { RookContext, RookContextValue } from "./type";

// Configuration pour createZodRook (ultra-simplifiée)
export interface ZodRookConfig<Schema extends z.ZodTypeAny> {
  schema: Schema;
  storeReducer?: any;
  reducers?: any;
  onValidationError?: (error: z.ZodError) => void;
  strict?: boolean;
}

// Hook personnalisé pour Zod qui inclut la validation (simplifié)
const createZodUseRook = (
  context: RookContext<any>,
  schema: z.ZodTypeAny,
  onValidationError?: (error: z.ZodError) => void,
  strict: boolean = false
) => {
  return (key?: string | undefined) => {
    const { store, update } = React.useContext(context);

    if (key === undefined) {
      // Fonction update avec validation complète du store
      const validatedUpdate = (values: any) => {
        const newValues = typeof values === "function" ? values(store) : values;

        try {
          // Valider les nouvelles valeurs avec le schéma
          const mergedStore = { ...store, ...newValues };
          schema.parse(mergedStore);
          update(newValues);
        } catch (error) {
          if (error instanceof z.ZodError) {
            if (onValidationError) {
              onValidationError(error);
            }
            if (strict) {
              throw error;
            }
            // En mode non-strict, on met à jour quand même mais on signale l'erreur
            console.warn("Zod validation failed:", error.errors);
            update(newValues);
          } else {
            throw error;
          }
        }
      };

      return [store, validatedUpdate];
    } else {
      // Fonction update spécifique pour une clé avec validation partielle
      const validatedKeyUpdate = (value: any) => {
        const partialUpdate = { [key]: value };

        try {
          // Valider la valeur de la clé spécifique
          const mergedStore = { ...store, ...partialUpdate };
          schema.parse(mergedStore);
          update(partialUpdate);
        } catch (error) {
          if (error instanceof z.ZodError) {
            if (onValidationError) {
              onValidationError(error);
            }
            if (strict) {
              throw error;
            }
            // En mode non-strict, on met à jour quand même
            console.warn("Zod validation failed for key:", key, error.errors);
            update(partialUpdate);
          } else {
            throw error;
          }
        }
      };

      return [store[key], validatedKeyUpdate];
    }
  };
};

/**
 * Crée un Rook store avec validation automatique via un schéma Zod
 * Utilise automatiquement les valeurs par défaut définies dans le schéma
 *
 * @param config Configuration contenant le schéma Zod et les options
 * @returns Un tuple [RookComponent, useZodRook] similaire à createRook
 *
 * @example
 * ```tsx
 * const UserSchema = z.object({
 *   name: z.string().min(1).default(""),
 *   age: z.number().min(0).max(120).default(0),
 *   email: z.string().email().default("")
 * });
 *
 * const [UserRook, useUser] = createZodRook({
 *   schema: UserSchema,
 *   onValidationError: (error) => console.error("Validation failed:", error)
 * });
 *
 * function App() {
 *   return (
 *     <UserRook>
 *       <UserForm />
 *     </UserRook>
 *   );
 * }
 *
 * function UserForm() {
 *   const [name, setName] = useUser("name");
 *   const [user, setUser] = useUser();
 *
 *   // setName et setUser valideront automatiquement avec le schéma
 *   // Le store initial utilisera les valeurs par défaut du schéma
 * }
 * ```
 */
export const createZodRook = (config: ZodRookConfig<any>): [any, any] => {
  const {
    schema,
    storeReducer,
    reducers,
    onValidationError,
    strict = false,
  } = config;

  // Créer le store par défaut en utilisant uniquement les valeurs par défaut du schéma Zod
  let validatedDefaultStore: any;
  try {
    // Obtenir les valeurs par défaut du schéma en parsant un objet vide
    validatedDefaultStore = schema.parse({});
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (strict) {
        throw new Error(
          `Schema must have default values for all required fields: ${error.errors
            .map((e: any) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")}`
        );
      }
      // En mode non-strict, créer un store minimal avec les erreurs loggées
      console.warn(
        "Schema parsing failed, some fields may not have default values:",
        error.errors
      );
      // Essayer de créer un store partiel avec ce qui est possible
      validatedDefaultStore = {};
    } else {
      throw error;
    }
  }

  const context = React.createContext({} as RookContextValue<any>);

  const ZodRook = ({ children }: React.PropsWithChildren) => (
    <Rook
      Provider={context.Provider}
      storeReducer={storeReducer}
      reducers={reducers}
      defaultStore={validatedDefaultStore}
    >
      {children}
    </Rook>
  );

  const useZodRook = createZodUseRook(
    context,
    schema,
    onValidationError,
    strict
  );

  return [ZodRook, useZodRook];
};

export default createZodRook;
