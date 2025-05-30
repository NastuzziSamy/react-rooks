import * as React from "react";
import { createStoreRook } from "react-rooks";

enum Locale {
  EN = "en",
  FR = "fr",
}

// Some global/stored values.
export const [Rook, useRook] = createStoreRook(
  {
    user: null as { id: number; name: string } | null,
    locale: Locale.EN,
    title: "My React app",
  },
  {
    reducers: {
      user: (newValue, oldValue) => {
        // If the user is the same, we do nothing.
        return newValue === oldValue ? oldValue : newValue;
      },
      title: (newValue, oldValue) => {
        // If the title is the same, we do nothing.
        return newValue === oldValue ? oldValue : newValue;
      },
      locale: (newValue, oldValue) => {
        // If the locale is the same, we do nothing.
        return newValue === oldValue ? oldValue : newValue;
      },
    },
    storeReducer: (values, store) => {
      return store;
    },
  }
);

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

export const App = () => (
  <Rook>
    <ChangeLocale />
    <ShowLocale />
  </Rook>
);

export default App;
