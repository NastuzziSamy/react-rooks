import * as React from "react";
import { createRook } from "react-rooks";

enum Locale {
  EN = "en",
  FR = "fr",
}

// Some global/stored values.
export const [Rook, useRook] = createRook({
  user: null as ({ id: number; name: string } | null),
  locale: Locale.EN,
  title: "My React app",
});

export const ChangeLocale = () => {
  const [title, setTitle] = useRook("title");
  const [user, setUser] = useRook("user");

  setUser({ id: 1, name: "John Doe" });
  setUser(null);
  setUser((prev: ) => ({
    id: prev?.id ? prev.id + 1 : 1,
    name: "Jane Doe",
  }));
  const [locale, setLocale] = useRook("locale");
  const [store, setStore] = useRook();

  React.useEffect(() => {
    setTimeout(() => setLocale(Locale.FR), 2500);
  }, []);

  return null;
};

export const ShowLocale = () => {
  const [locale] = useRook("locale");

  // Log: 'en'.
  // After 2.5s, log: 'fr'.
  console.log(locale);

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
