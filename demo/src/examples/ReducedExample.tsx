import React from "react";
import { createRook } from "react-rooks";

const Locale = {
  EN: "en",
  FR: "fr",
} as const;

type LocaleType = (typeof Locale)[keyof typeof Locale];

// Simulation d'une API de traduction
const I18N_CONFIGS = {
  locale: Locale.FR as LocaleType, // Initialisé avec la valeur par défaut
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

// Store avec reducers simulés
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
    last_action: "Initialisation",
    locale: Locale.FR,
  },
  reducers: {
    locale: (newValue: LocaleType, oldValue: LocaleType) => {
      // Reducer pour la langue - effectue des side effects
      if (newValue !== oldValue) {
        i18n.changeLocale(newValue);
        console.log(`🌍 Langue changée: ${oldValue} → ${newValue}`);
      }
      return newValue;
    },
    user_count: (newValue: number, oldValue: number) => {
      // Reducer pour le compteur d'utilisateurs
      console.log(`👥 Nombre d'utilisateurs: ${oldValue} → ${newValue}`);
      return newValue;
    },
  },
});

const LanguageControls = () => {
  const [locale, setLocale] = useRook("locale");

  return (
    <div className="demo-section">
      <h3>🌍 Contrôles de Langue (avec Reducer)</h3>
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
      <div className="demo-state">Langue actuelle: {locale.toUpperCase()}</div>
    </div>
  );
};

const TranslationDisplay = () => {
  const [greetingKey] = useRook("greeting_key");

  return (
    <div className="demo-section">
      <h3>💬 Traductions Dynamiques</h3>
      <div className="demo-state">
        <div>
          <strong>Salutation:</strong> {i18n.t(greetingKey)}
        </div>
        <div>
          <strong>Bienvenue:</strong> {i18n.t("welcome")}
        </div>
        <div>
          <strong>Au revoir:</strong> {i18n.t("goodbye")}
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
      <h3>📄 Gestion du Titre (avec Store Reducer)</h3>
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
        Clé du titre: {lazyTitle}
        <br />
        Titre traduit: {i18n.t(lazyTitle)}
      </div>
      <div className="demo-info">
        💡 Le titre de l'onglet du navigateur se met à jour automatiquement
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
      <h3>👥 Compteur d'Utilisateurs (avec Reducer)</h3>
      <div className="demo-controls">
        <button className="demo-button" onClick={addUser}>
          + Utilisateur
        </button>
        <button
          className="demo-button"
          onClick={removeUser}
          disabled={userCount === 0}
        >
          - Utilisateur
        </button>
        <button className="demo-button secondary" onClick={resetUsers}>
          Reset
        </button>
      </div>
      <div className="demo-state">Nombre d'utilisateurs: {userCount}</div>
    </div>
  );
};

const ActionLogger = () => {
  const [lastAction] = useRook("last_action");

  return (
    <div className="demo-section">
      <h3>📝 Dernière Action (Store Reducer)</h3>
      <div className="status-display">{lastAction}</div>
    </div>
  );
};

const CompleteState = () => {
  const [store] = useRook();

  return (
    <div className="demo-section">
      <h3>📊 État Complet du Store</h3>
      <div className="demo-state">{JSON.stringify(store, null, 2)}</div>
    </div>
  );
};

const ReducedExample = () => {
  return (
    <Rook>
      <div className="example-demo">
        <div className="demo-info">
          <strong>Exemple avec Reducers :</strong> Utilisation de{" "}
          <code>createRook</code> avec des reducers pour la logique métier et
          les effets de bord.
        </div>

        <LanguageControls />
        <TranslationDisplay />
        <TitleManager />
        <UserCounter />
        <ActionLogger />
        <CompleteState />

        <div className="demo-info">
          💡 Ouvrez la console pour voir les logs des reducers en action !
        </div>
      </div>
    </Rook>
  );
};

export default ReducedExample;
