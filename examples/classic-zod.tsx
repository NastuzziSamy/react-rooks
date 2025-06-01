import * as React from "react";
import { z } from "zod";
import { createZodRook } from "react-rooks/zod";

export enum Locale {
  EN = "en",
  FR = "fr",
}

export const rookSchema = z.object({
  user: z
    .object({ id: z.number(), name: z.string() })
    .nullable()
    .transform((val) => (val ? { id: val.id, name: val.name } : null)),
  locale: z.nativeEnum(Locale).default(Locale.EN),
  title: z.string().default("My React app"),
  inputNumber: z.coerce.number().optional(),
});

export type RookStore = z.input<typeof rookSchema>;

// Some global/stored values.
export const [Rook, useRook] = createZodRook(rookSchema, {
  // storeReducer: (values, store) => {
  //   return { ...store, ...values };
  // },
  onValidationError: (error, values, currentStore) => {
    console.error("Validation error:", error);
    console.error("Values:", values);
    console.error("Current store:", currentStore);
  },
});

export const ChangeLocale = () => {
  const [title, setTitle] = useRook("title");
  const [user, setUser] = useRook("user");

  // Test des types - ces lignes devraient compiler sans erreur
  // user devrait être: { id: number; name: string } | null
  // title devrait être: string
  // locale devrait être: Locale

  setUser({ id: 1, name: "John Doe" });
  setUser(null);
  setUser((prev) => {
    // Vérification stricte du type prev
    if (prev) {
      return { id: prev.id + 1, name: "Jane Doe" };
    }
    return { id: 1, name: "Jane Doe" };
  });

  // Test de type: user peut être null
  if (user) {
    console.log(user.id, user.name); // user.id et user.name devraient être disponibles
  }

  const [locale, setLocale] = useRook("locale");
  const [store, setStore] = useRook();

  React.useEffect(() => {
    setTimeout(() => setLocale(Locale.FR), 2500);
  }, []);

  return null;
};

export const ShowLocale = () => {
  const [locale] = useRook("locale");

  // Show: 'en'.
  // After 2.5s, show: 'fr'.
  return (
    <div>
      <h1>Current locale: {locale}</h1>
    </div>
  );
};

// Will on work with Zod v4
// export const InputNumber = () => {
//   const [inputNumber, setInputNumber] = useRook("inputNumber");

//   return (
//     <div>
//       <h2>Input Number</h2>
//       <input
//         type="number"
//         value={inputNumber ?? ""}
//         onChange={(e) => setInputNumber(e.target.value)}
//       />
//       <p>Current input number: {inputNumber}</p>
//     </div>
//   );
// };

export const App = () => (
  <Rook>
    <ChangeLocale />
    <ShowLocale />
    {/* <InputNumber /> */}
  </Rook>
);

export default App;
