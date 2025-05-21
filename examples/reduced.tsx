import * as React from "react";
import { createRook } from "react-rooks";

enum Locale {
  EN = "en",
  FR = "fr",
}

// Simulate a translation file.
const I18N_CONFIGS = {
  locale: null as unknown as Locale,
};
const TRANSLATIONS = {
  [Locale.EN]: {
    page_title: "My React app",
    greeting: "Hello, do you like React Rooks?",
  },
  [Locale.FR]: {
    page_title: "Mon application React",
    greeting: "Bonjour, aimez-vous React Rooks ?",
  },
};
const i18n = {
  changeLocale: (locale: Locale) => {
    I18N_CONFIGS.locale = locale;
  },
  t: (key: string) => TRANSLATIONS[I18N_CONFIGS.locale][key],
};

export const [Rook, useRook] = createRook({
  defaultStore: {
    lazy_title: "page_title",
  },
  init: (store) => {
    // Set the initial locale. Here we defined the locale in the store.
    // In a real app, you would probably get the locale from the browser or
    // from a cookie.
    i18n.changeLocale(Locale.EN);

    return store as {
      locale: Locale;
      lazy_title: keyof (typeof TRANSLATIONS)[Locale.EN];
    };
  },
});

export const ChangeLocale = () => {
  const [locale, setLocale] = useRook("locale");

  /**
   * Click on the buttons to change the locale.
   */
  return (
    <div>
      <button onClick={() => setLocale(Locale.EN)}>EN</button>
      <button onClick={() => setLocale(Locale.FR)}>FR</button>
    </div>
  );
};

export const ShowLocale = () => {
  const [locale] = useRook("locale");

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
