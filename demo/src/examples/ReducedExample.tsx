import React from "react";
import { createRook } from "react-rooks";
import CodeTooltip from "../components/CodeTooltip";

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
  lazyTitle: string;
  greetingKey: string;
  userCount: number;
  lastAction: string;
  locale: LocaleType;
}>({
  defaultStore: {
    lazyTitle: "page_title",
    greetingKey: "greeting",
    userCount: 0,
    lastAction: "Initialization",
    locale: Locale.FR,
  },
  reducers: {
    locale: (newValue, oldValue) => {
      // Language reducer - performs side effects
      if (newValue !== oldValue) {
        i18n.changeLocale(newValue);
        console.log(`🌍 Language changed: ${oldValue} → ${newValue}`);
      }
      return newValue;
    },
    userCount: (newValue, oldValue) => {
      // User count reducer
      if (newValue <= 0) {
        console.warn("👥 User count cannot be less than 0. Resetting to 0.");
        return 0;
      }

      console.log(`👥 User count: ${oldValue} → ${newValue}`);
      return newValue;
    },
  },
  storeReducer: (newValues, store) => {
    // Store reducer - handles side effects and updates
    if (newValues.lazyTitle && newValues.lazyTitle !== store.lazyTitle) {
      document.title = i18n.t(newValues.lazyTitle);
      console.log(
        `📄 Title updated: ${store.lazyTitle} → ${newValues.lazyTitle}`
      );
      newValues.lastAction = `Title changed to ${newValues.lazyTitle}`;
    } else if (newValues.locale && newValues.locale !== store.locale) {
      document.title = i18n.t(store.lazyTitle);
      newValues.lastAction = `Locale changed to ${newValues.locale}`;
    } else if (newValues.userCount !== undefined) {
      if (newValues.userCount === 0 && store.userCount === 0) {
        newValues.lastAction = `User count remains at 0`;
      } else {
        newValues.lastAction = `User count changed to ${newValues.userCount}`;
      }
    }

    return newValues;
  },
});

const LanguageControls = () => {
  const [locale, setLocale] = useRook("locale");

  const languageCodeTooltip = `// Language Reducer with Side Effects
const [Rook, useRook] = createRook({
  defaultStore: {
    locale: "fr",
    // ...other state
  },
  reducers: {
    locale: (newValue, oldValue) => {
      // Reducer performs side effects when locale changes
      if (newValue !== oldValue) {
        i18n.changeLocale(newValue);
        console.log(\`🌍 Language changed: \${oldValue} → \${newValue}\`);
      }
      return newValue;
    },
  },
});

// Component using locale reducer
const LanguageControls = () => {
  const [locale, setLocale] = useRook("locale");
  
  // When locale changes, reducer automatically handles i18n setup
  return (
    <button onClick={() => setLocale("en")}>
      Switch to English
    </button>
  );
};`;

  return (
    <div className="demo-section">
      <h3>🌍 Language Controls (with Reducer)</h3>
      <CodeTooltip code={languageCodeTooltip} />
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
      <div className="demo-info">
        💡 Language changes go through the reducer which automatically updates
        the i18n configuration
      </div>
    </div>
  );
};

const TranslationDisplay = () => {
  const [greetingKey] = useRook("greetingKey");

  const translationCodeTooltip = `// Dynamic Translation Component
const TranslationDisplay = () => {
  const [greetingKey] = useRook("greetingKey");
  
  // i18n.t() automatically uses current locale from store
  // When locale changes via reducer, all translations update
  return (
    <div>
      <strong>Greeting:</strong> {i18n.t(greetingKey)}
      <strong>Welcome:</strong> {i18n.t("welcome")}
    </div>
  );
};

// Translation keys stored in store, actual text resolved dynamically
// EN: "Hello, do you like React Rooks?"
// FR: "Bonjour, aimez-vous React Rooks ?"`;

  return (
    <div className="demo-section">
      <h3>💬 Dynamic Translations</h3>
      <CodeTooltip code={translationCodeTooltip} />
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

const titleTooltip = `// Store Reducer for Complex Side Effects
  const [Rook, useRook] = createRook({
    defaultStore: { lazyTitle: "page_title" },
    storeReducer: (newValues, store) => {
      // Store reducer runs on every state change
      if (newValues.lazyTitle && newValues.lazyTitle !== store.lazyTitle) {
        // Side effect: Update browser tab title
        document.title = i18n.t(newValues.lazyTitle);
        console.log(\`📄 Title updated: \${store.lazyTitle} → \${newValues.lazyTitle}\`);
        
        // Can modify other state values during update
        newValues.lastAction = \`Title changed to \${newValues.lazyTitle}\`;
      }
      return newValues;
    },
  });

  // Component that triggers store reducer
  const TitleManager = () => {
    const [lazyTitle, setLazyTitle] = useRook("lazyTitle");
    
    // When lazyTitle changes, storeReducer automatically:
    // 1. Updates document.title with translated text
    // 2. Logs the change
    // 3. Updates lastAction field
    return (
      <button onClick={() => setLazyTitle("welcome")}>
        Change Title
      </button>
    );
  };`;

const TitleManager = () => {
  const [lazyTitle, setLazyTitle] = useRook("lazyTitle");

  const titleOptions = ["page_title", "welcome", "goodbye"] as const;

  return (
    <div className="demo-section">
      <h3>📄 Title Management (with Store Reducer)</h3>
      <CodeTooltip code={titleTooltip} />
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
  const [userCount, setUserCount] = useRook("userCount");
  const addUser = () => setUserCount((prev) => prev + 1);
  const removeUser = () => setUserCount((prev) => Math.max(prev - 1, 0));
  const resetUsers = () => setUserCount(0);

  const userCounterTooltip = `// User Counter with Validation Reducer
const [Rook, useRook] = createRook({
  defaultStore: {
    userCount: 0,
    // ...other state
  },
  reducers: {
    userCount: (newValue, oldValue) => {
      // Reducer validates and handles negative values
      if (newValue <= 0) {
        console.warn("👥 User count cannot be less than 0. Resetting to 0.");
        return 0;
      }
      
      console.log(\`👥 User count: \${oldValue} → \${newValue}\`);
      return newValue;
    },
  },
});

// Component using user counter with reducer validation
const UserCounter = () => {
  const [userCount, setUserCount] = useRook("userCount");
  
  const addUser = () => setUserCount((prev) => prev + 1);
  const removeUser = () => setUserCount((prev) => prev - 1); // Reducer handles validation if count < 0
  const resetUsers = () => setUserCount(0);
  
  return (
    <div>
      <button onClick={addUser}>+ User</button>
      <button onClick={removeUser}>- User</button>
      <button onClick={resetUsers}>Reset</button>
      <div>User count: {userCount}</div>
    </div>
  );
};`;

  return (
    <div className="demo-section">
      <h3>👥 User Counter (with Reducer)</h3>
      <CodeTooltip code={userCounterTooltip} />
      <div className="demo-controls">
        <button className="demo-button" onClick={addUser}>
          + User
        </button>
        <button className="demo-button" onClick={removeUser}>
          - User
        </button>
        <button className="demo-button secondary" onClick={resetUsers}>
          Reset
        </button>
      </div>
      <div className="demo-state">User count: {userCount}</div>
      <div className="demo-info">
        💡 The reducer prevents negative values and logs all changes
      </div>
    </div>
  );
};

const ActionLogger = () => {
  const [lastAction] = useRook("lastAction");

  const actionLoggerTooltip = `// Action Logger Component
const ActionLogger = () => {
  const [lastAction] = useRook("lastAction");
  
  // This component automatically updates when lastAction changes
  // The lastAction value is updated by the storeReducer
  return (
    <div className="demo-section">
      <h3>📝 Last Action (Store Reducer)</h3>
      <div className="status-display">{lastAction}</div>
    </div>
  );
};

// Store reducer automatically updates lastAction on every change
storeReducer: (newValues, store) => {
  if (newValues.lazyTitle && newValues.lazyTitle !== store.lazyTitle) {
    newValues.lastAction = \`Title changed to \${newValues.lazyTitle}\`;
  } else if (newValues.locale && newValues.locale !== store.locale) {
    newValues.lastAction = \`Locale changed to \${newValues.locale}\`;
  } else if (newValues.userCount !== undefined) {
    newValues.lastAction = \`User count changed to \${newValues.userCount}\`;
  }
  return newValues;
}`;

  return (
    <div className="demo-section">
      <h3>📝 Last Action (Store Reducer)</h3>
      <CodeTooltip code={actionLoggerTooltip} />
      <div className="status-display">{lastAction}</div>
    </div>
  );
};

const CompleteState = () => {
  const [store] = useRook();

  const completeStateTooltip = `// Complete Store State Display
const CompleteState = () => {
  const [store] = useRook();
  
  // useRook() without parameters returns the entire store
  // This component re-renders whenever any store value changes
  return (
    <div className="demo-section">
      <h3>📊 Complete Store State</h3>
      <div className="demo-state">
        {JSON.stringify(store, null, 2)}
      </div>
    </div>
  );
};

// Store structure:
// {
//   lazyTitle: "page_title",
//   greetingKey: "greeting", 
//   userCount: 0,
//   lastAction: "Initialization",
//   locale: "fr"
// }`;

  return (
    <div className="demo-section">
      <h3>📊 Complete Store State</h3>
      <CodeTooltip code={completeStateTooltip} />
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
