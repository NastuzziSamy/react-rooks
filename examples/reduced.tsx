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
  t: (key: keyof (typeof TRANSLATIONS)[Locale.EN]) =>
    TRANSLATIONS[I18N_CONFIGS.locale][key],
};

export const [Rook, useRook] = createRook({
  defaultStore: {
    user: null as { id: number; name: string } | null,
    lazy_title: "page_title" as keyof (typeof TRANSLATIONS)[Locale.EN],
  },
  init: async (store) => {
    // Set the initial locale. Here we defined the locale in the store.
    // In a real app, you would probably get the locale from the browser or
    // from a cookie.
    i18n.changeLocale(Locale.EN);

    return {
      ...store,
      locale: Locale.EN as Locale,
    };
  },
  reducers: {
    lazy_title: (newValue, oldValue) => {
      // If the lazy_title is the same, we do nothing.
      return newValue;
    },
    locale: (newValue, oldValue) => {
      // If the locale is the same, we do nothing.
      if (newValue !== oldValue) {
        i18n.changeLocale(newValue);
      }

      return newValue;
    },
  },
  storeReducer: (values, store) => {
    // If the lazy_title is changed, we update the title.
    if (values.lazy_title && values.lazy_title !== store.lazy_title) {
      document.title = i18n.t(values.lazy_title);
    }

    return values;
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

export const ShowStore = () => {
  const [store] = useRook();

  return (
    <div>
      <h2>Store:</h2>
      <pre>{JSON.stringify(store, null, 2)}</pre>
      <h2>Lazy title:</h2>
      <p>{i18n.t(store.lazy_title)}</p>
    </div>
  );
};

export const App = () => (
  <Rook>
    <ChangeLocale />
    <ShowLocale />
    <ShowStore />
  </Rook>
);

export default App;
