import React from "react";
import { createRook } from "react-rooks";

const Locale = {
  EN: "en",
  FR: "fr",
} as const;

type LocaleType = (typeof Locale)[keyof typeof Locale];

// Translation API simulation
const I18N_CONFIGS = {
  locale: Locale.FR as LocaleType, // Initialized with default value
};

const TRANSLATIONS = {
  [Locale.EN]: {
    page_title: "My React App",
    greeting: "Hello, do you like React Rooks?",
    welcome: "Welcome!",
    goodbye: "Goodbye!",
  },
  [Locale.FR]: {
    page_title: "Mon Application React",
    greeting: "Bonjour, aimez-vous React Rooks ?",
    welcome: "Bienvenue !",
    goodbye: "Au revoir !",
  },
} as const;

const i18n = {
  changeLocale: (locale: LocaleType) => {
    I18N_CONFIGS.locale = locale;
  },
  t: (key: string) => {
    const currentLocale = I18N_CONFIGS.locale || Locale.FR;
    const translations =
      TRANSLATIONS[currentLocale as keyof typeof TRANSLATIONS];
    if (!translations) {
      console.warn(`No translations found for locale: ${currentLocale}`);
      return key;
    }
    const translatedValue = (translations as Record<string, string>)[key];
    if (translatedValue === undefined) {
      console.warn(
        `Translation key "${key}" not found for locale: ${currentLocale}`
      );
      return key;
    }
    return translatedValue;
  },
};

// Store with simulated reducers
const [Rook, useRook] = createRook<{
  lazy_title: string;
  greeting_key: string;
  user_count: number;
  last_action: string;
  locale: LocaleType;
}>({
  defaultStore: {
    lazy_title: "page_title",
    greeting_key: "greeting",
    user_count: 0,
    last_action: "Initialization",
    locale: Locale.FR,
  },
  reducers: {
    locale: (newValue: LocaleType, oldValue: LocaleType) => {
      // Language reducer - performs side effects
      if (newValue !== oldValue) {
        i18n.changeLocale(newValue);
        console.log(`🌍 Language changed: ${oldValue} → ${newValue}`);
      }
      return newValue;
    },
    user_count: (newValue: number, oldValue: number) => {
      // User count reducer
      console.log(`👥 User count: ${oldValue} → ${newValue}`);
      return newValue;
    },
  },
  storeReducer: (newValues, store) => {
    // Store reducer - handles side effects and updates
    if (newValues.lazy_title && newValues.lazy_title !== store.lazy_title) {
      document.title = i18n.t(newValues.lazy_title);
      console.log(
        `📄 Title updated: ${store.lazy_title} → ${newValues.lazy_title}`
      );
      newValues.last_action = `Title changed to ${newValues.lazy_title}`;
    } else if (newValues.locale && newValues.locale !== store.locale) {
      document.title = i18n.t(store.lazy_title);
      console.log(`🌍 Locale changed: ${store.locale} → ${newValues.locale}`);
      newValues.last_action = `Locale changed to ${newValues.locale}`;
    } else if (newValues.user_count !== undefined) {
      console.log(
        `👥 User count updated: ${store.user_count} → ${newValues.user_count}`
      );
      newValues.last_action = `User count changed to ${newValues.user_count}`;
    }

    return newValues;
  },
});

const LanguageControls = () => {
  const [locale, setLocale] = useRook("locale");

  return (
    <div className="demo-section">
      <h3>🌍 Language Controls (with Reducer)</h3>
      <div className="demo-controls">
        <div className="locale-buttons">
          <button
            className={`locale-button ${locale === Locale.EN ? "active" : ""}`}
            onClick={() => setLocale(Locale.EN)}
          >
            English
          </button>
          <button
            className={`locale-button ${locale === Locale.FR ? "active" : ""}`}
            onClick={() => setLocale(Locale.FR)}
          >
            Français
          </button>
        </div>
      </div>
      <div className="demo-state">Current language: {locale.toUpperCase()}</div>
    </div>
  );
};

const TranslationDisplay = () => {
  const [greetingKey] = useRook("greeting_key");

  return (
    <div className="demo-section">
      <h3>💬 Dynamic Translations</h3>
      <div className="demo-state">
        <div>
          <strong>Greeting:</strong> {i18n.t(greetingKey)}
        </div>
        <div>
          <strong>Welcome:</strong> {i18n.t("welcome")}
        </div>
        <div>
          <strong>Goodbye:</strong> {i18n.t("goodbye")}
        </div>
      </div>
    </div>
  );
};

const TitleManager = () => {
  const [lazyTitle, setLazyTitle] = useRook("lazy_title");

  const titleOptions = ["page_title", "welcome", "goodbye"] as const;

  return (
    <div className="demo-section">
      <h3>📄 Title Management (with Store Reducer)</h3>
      <div className="demo-controls">
        {titleOptions.map((title) => (
          <button
            key={title}
            className={`demo-button ${lazyTitle === title ? "" : "secondary"}`}
            onClick={() => setLazyTitle(title)}
          >
            {title.replace("_", " ")}
          </button>
        ))}
      </div>
      <div className="demo-state">
        Title key: {lazyTitle}
        <br />
        Translated title: {i18n.t(lazyTitle)}
      </div>
      <div className="demo-info">
        💡 The browser tab title updates automatically
      </div>
    </div>
  );
};

const UserCounter = () => {
  const [userCount, setUserCount] = useRook("user_count");

  const addUser = () => setUserCount(userCount + 1);
  const removeUser = () => setUserCount(Math.max(0, userCount - 1));
  const resetUsers = () => setUserCount(0);

  return (
    <div className="demo-section">
      <h3>👥 User Counter (with Reducer)</h3>
      <div className="demo-controls">
        <button className="demo-button" onClick={addUser}>
          + User
        </button>
        <button
          className="demo-button"
          onClick={removeUser}
          disabled={userCount === 0}
        >
          - User
        </button>
        <button className="demo-button secondary" onClick={resetUsers}>
          Reset
        </button>
      </div>
      <div className="demo-state">User count: {userCount}</div>
    </div>
  );
};

const ActionLogger = () => {
  const [lastAction] = useRook("last_action");

  return (
    <div className="demo-section">
      <h3>📝 Last Action (Store Reducer)</h3>
      <div className="status-display">{lastAction}</div>
    </div>
  );
};

const CompleteState = () => {
  const [store] = useRook();

  return (
    <div className="demo-section">
      <h3>📊 Complete Store State</h3>
      <div className="demo-state">{JSON.stringify(store, null, 2)}</div>
    </div>
  );
};

const ReducedExample = () => {
  return (
    <Rook>
      <div className="example-demo">
        <div className="demo-info">
          <strong>Example with Reducers:</strong> Using <code>createRook</code>{" "}
          with reducers for business logic and side effects.
        </div>

        <LanguageControls />
        <TranslationDisplay />
        <TitleManager />
        <UserCounter />
        <ActionLogger />
        <CompleteState />

        <div className="demo-info">
          💡 Open the console to see the reducer logs in action!
        </div>
      </div>
    </Rook>
  );
};

export default ReducedExample;
