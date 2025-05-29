import React, { useEffect } from "react";
import { createRook } from "react-rooks";

const Locale = {
  EN: "en",
  FR: "fr",
} as const;

// Store global avec createRook
const [Rook, useRook] = createRook({
  defaultStore: {
    user: null as { id: number; name: string } | null,
    locale: Locale.EN,
    title: "Mon App React",
    counter: 0,
  },
});

const UserManager = () => {
  const [user, setUser] = useRook("user");

  const loginUser = () => {
    setUser({ id: Date.now(), name: "John Doe" });
  };

  const logoutUser = () => {
    setUser(null);
  };

  const updateUser = () => {
    setUser((prev: { id: number; name: string } | null) =>
      prev ? { ...prev, name: "Jane Doe" } : null
    );
  };

  return (
    <div className="demo-section">
      <h3>👤 Gestion Utilisateur</h3>
      <div className="demo-controls">
        <button className="demo-button" onClick={loginUser}>
          Se connecter
        </button>
        <button className="demo-button secondary" onClick={logoutUser}>
          Se déconnecter
        </button>
        <button
          className="demo-button secondary"
          onClick={updateUser}
          disabled={!user}
        >
          Changer nom
        </button>
      </div>
      <div className="demo-state">
        Utilisateur: {user ? `${user.name} (ID: ${user.id})` : "Non connecté"}
      </div>
    </div>
  );
};

const LocaleManager = () => {
  const [locale, setLocale] = useRook("locale");

  useEffect(() => {
    // Simulation d'un changement automatique après 5 secondes
    const timer = setTimeout(() => {
      setLocale(locale === Locale.EN ? Locale.FR : Locale.EN);
    }, 5000);

    return () => clearTimeout(timer);
  }, [locale, setLocale]);

  return (
    <div className="demo-section">
      <h3>🌍 Langue</h3>
      <div className="demo-controls">
        <div className="locale-buttons">
          <button
            className={`locale-button ${locale === Locale.EN ? "active" : ""}`}
            onClick={() => setLocale(Locale.EN)}
          >
            EN
          </button>
          <button
            className={`locale-button ${locale === Locale.FR ? "active" : ""}`}
            onClick={() => setLocale(Locale.FR)}
          >
            FR
          </button>
        </div>
      </div>
      <div className="demo-state">Langue actuelle: {locale.toUpperCase()}</div>
      <div className="demo-info">
        💡 La langue change automatiquement toutes les 5 secondes
      </div>
    </div>
  );
};

const Counter = () => {
  const [counter, setCounter] = useRook("counter");

  const increment = () => setCounter(counter + 1);
  const decrement = () => setCounter(counter - 1);
  const reset = () => setCounter(0);

  return (
    <div className="demo-section">
      <h3>🔢 Compteur Global</h3>
      <div className="demo-controls">
        <button className="demo-button" onClick={increment}>
          + 1
        </button>
        <button className="demo-button" onClick={decrement}>
          - 1
        </button>
        <button className="demo-button secondary" onClick={reset}>
          Reset
        </button>
      </div>
      <div className="demo-state">Compteur: {counter}</div>
    </div>
  );
};

const StoreDisplay = () => {
  const [store] = useRook();

  return (
    <div className="demo-section">
      <h3>📊 État Complet du Store</h3>
      <div className="demo-state">{JSON.stringify(store, null, 2)}</div>
    </div>
  );
};

const ClassicExample = () => {
  return (
    <Rook>
      <div className="example-demo">
        <div className="demo-info">
          <strong>Exemple Classique :</strong> Utilisation de{" "}
          <code>createRook</code> pour créer un store global simple. Tous les
          composants peuvent accéder et modifier l'état partagé.
        </div>

        <UserManager />
        <LocaleManager />
        <Counter />
        <StoreDisplay />
      </div>
    </Rook>
  );
};

export default ClassicExample;
