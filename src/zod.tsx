import * as React from "react";
import { z } from "zod";

import Rook from "./rook";
import type {
  RookContext,
  RookContextValue,
  UseStoreHookReturn,
  RookStoreReducer,
  RookReducers,
  RookComponent,
} from "./type";

// Type pour extraire le type du store à partir d'un schéma Zod
type ZodStoreSchema<T extends z.ZodTypeAny> = T extends z.ZodType<infer U>
  ? U
  : never;

// Configuration pour createZodRook
export interface ZodRookConfig<Schema extends z.ZodTypeAny> {
  schema: Schema;
  storeReducer?: RookStoreReducer<ZodStoreSchema<Schema>>;
  reducers?: RookReducers<ZodStoreSchema<Schema>>;
  onValidationError?: (error: z.ZodError) => void;
  strict?: boolean; // Si true, lance une erreur en cas de validation échouée
}

// Hook personnalisé pour Zod qui inclut la validation
const createZodUseRook =
  <Schema extends z.ZodTypeAny>(
    context: RookContext<ZodStoreSchema<Schema>>,
    schema: Schema,
    onValidationError?: (error: z.ZodError) => void,
    strict: boolean = false
  ) =>
  <StoreKey extends keyof ZodStoreSchema<Schema> | undefined = undefined>(
    key?: StoreKey
  ): UseStoreHookReturn<ZodStoreSchema<Schema>, StoreKey> => {
    const { store, update } =
      React.useContext<RookContextValue<ZodStoreSchema<Schema>>>(context);

    if (key === undefined) {
      // Fonction update avec validation complète du store
      const validatedUpdate = (
        values:
          | Partial<ZodStoreSchema<Schema>>
          | ((prev: ZodStoreSchema<Schema>) => Partial<ZodStoreSchema<Schema>>)
      ) => {
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

      return [store, validatedUpdate] as UseStoreHookReturn<
        ZodStoreSchema<Schema>,
        StoreKey
      >;
    }

    // Fonction setValue avec validation partielle
    const setValue = (
      value:
        | ZodStoreSchema<Schema>[Extract<
            StoreKey,
            keyof ZodStoreSchema<Schema>
          >]
        | ((
            prev: ZodStoreSchema<Schema>[Extract<
              StoreKey,
              keyof ZodStoreSchema<Schema>
            >]
          ) => ZodStoreSchema<Schema>[Extract<
            StoreKey,
            keyof ZodStoreSchema<Schema>
          >])
    ) => {
      const newValue =
        typeof value === "function"
          ? (value as any)(
              store[key as Extract<StoreKey, keyof ZodStoreSchema<Schema>>]
            )
          : value;

      try {
        // Valider la nouvelle valeur avec le schéma partiel si possible
        const partialUpdate = { [key]: newValue };
        const mergedStore = { ...store, ...partialUpdate };

        // Essayer de valider le store complet
        schema.parse(mergedStore);

        update(partialUpdate as unknown as Partial<ZodStoreSchema<Schema>>);
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
          update({
            [key]: newValue,
          } as unknown as Partial<ZodStoreSchema<Schema>>);
        } else {
          throw error;
        }
      }
    };

    return [
      store[key as keyof ZodStoreSchema<Schema>],
      setValue,
    ] as UseStoreHookReturn<ZodStoreSchema<Schema>, StoreKey>;
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
export const createZodRook = <Schema extends z.ZodTypeAny>({
  schema,
  storeReducer,
  reducers,
  onValidationError,
  strict = false,
}: ZodRookConfig<Schema>): [
  RookComponent,
  <StoreKey extends keyof ZodStoreSchema<Schema> | undefined = undefined>(
    key?: StoreKey
  ) => UseStoreHookReturn<ZodStoreSchema<Schema>, StoreKey>
] => {
  type Store = ZodStoreSchema<Schema>;

  // Créer le store par défaut en utilisant uniquement les valeurs par défaut du schéma Zod
  let validatedDefaultStore: Store;
  try {
    // Obtenir les valeurs par défaut du schéma en parsant un objet vide
    validatedDefaultStore = schema.parse({});
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (strict) {
        throw new Error(
          `Schema must have default values for all required fields: ${error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")}`
        );
      }
      // En mode non-strict, créer un store minimal avec les erreurs loggées
      console.warn(
        "Schema parsing failed, some fields may not have default values:",
        error.errors
      );
      // Essayer de créer un store partiel avec ce qui est possible
      validatedDefaultStore = {} as Store;
    } else {
      throw error;
    }
  }

  const context = React.createContext({} as RookContextValue<Store>);

  const ZodRook = ({ children }: React.PropsWithChildren) => (
    <Rook<Store, Store>
      Provider={context.Provider}
      storeReducer={storeReducer}
      reducers={reducers}
      defaultStore={validatedDefaultStore}
    >
      {children}
    </Rook>
  );

  const useZodRook = createZodUseRook<Schema>(
    context,
    schema,
    onValidationError,
    strict
  );

  return [ZodRook, useZodRook];
};

/**
 * Crée un Rook store avec validation Zod en mode strict
 * En cas d'erreur de validation, lance une exception
 */
export const createStrictZodRook = <Schema extends z.ZodTypeAny>(
  config: Omit<ZodRookConfig<Schema>, "strict">
) => {
  return createZodRook({ ...config, strict: true });
};

export default createZodRook;
