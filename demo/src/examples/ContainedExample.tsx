import React from "react";
import { createRook } from "react-rooks";

const Locale = {
  EN: "en",
  FR: "fr",
} as const;

type LocaleType = (typeof Locale)[keyof typeof Locale];

// Store contenu - chaque instance de Rook a son propre state
const [Rook, useRook] = createRook<{
  user: { id: number; name: string } | null;
  locale: LocaleType;
  title: string;
  messages: string[];
}>({
  defaultStore: {
    user: null,
    locale: Locale.EN,
    title: "App Contendue",
    messages: [],
  },
});

const MessageManager = ({ instanceName }: { instanceName: string }) => {
  const [messages, setMessages] = useRook("messages");

  const addMessage = () => {
    const newMessage = `Message ${messages.length + 1} de ${instanceName}`;
    setMessages([...messages, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="demo-section">
      <h4>💬 Messages pour {instanceName}</h4>
      <div className="demo-controls">
        <button className="demo-button" onClick={addMessage}>
          Ajouter Message
        </button>
        <button className="demo-button secondary" onClick={clearMessages}>
          Vider
        </button>
      </div>
      <div className="demo-state">
        Messages ({messages.length}):
        {messages.length > 0 && (
          <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1rem" }}>
            {messages.map((msg: string, idx: number) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const InstanceManager = ({ instanceName }: { instanceName: string }) => {
  const [user, setUser] = useRook("user");
  const [locale, setLocale] = useRook("locale");

  const loginUser = () => {
    setUser({ id: Date.now(), name: `Utilisateur ${instanceName}` });
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <div className="demo-section">
      <h4>👤 Utilisateur {instanceName}</h4>
      <div className="demo-controls">
        <button className="demo-button" onClick={loginUser}>
          Se connecter
        </button>
        <button className="demo-button secondary" onClick={logoutUser}>
          Se déconnecter
        </button>
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
      <div className="demo-state">
        Utilisateur: {user ? user.name : "Non connecté"}
        <br />
        Langue: {locale.toUpperCase()}
      </div>
    </div>
  );
};

const ContainedInstance = ({ instanceName }: { instanceName: string }) => {
  return (
    <Rook>
      <div
        style={{
          border: "2px solid #e2e8f0",
          borderRadius: "8px",
          padding: "1rem",
          background: "white",
        }}
      >
        <h3 style={{ margin: "0 0 1rem 0", color: "#4a5568" }}>
          🏠 Instance: {instanceName}
        </h3>
        <InstanceManager instanceName={instanceName} />
        <MessageManager instanceName={instanceName} />
      </div>
    </Rook>
  );
};

const ContainedExample = () => {
  return (
    <div className="example-demo">
      <div className="demo-info">
        <strong>Exemple Contenu :</strong> Chaque composant{" "}
        <code>&lt;Rook&gt;</code> maintient son propre état indépendant. Les
        modifications dans une instance n'affectent pas les autres.
      </div>

      <div
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        }}
      >
        <ContainedInstance instanceName="A" />
        <ContainedInstance instanceName="B" />
      </div>

      <div className="demo-info" style={{ marginTop: "2rem" }}>
        💡 Remarquez que chaque instance maintient son propre état utilisateur,
        langue et messages. C'est idéal pour des composants réutilisables avec
        leur propre logique d'état.
      </div>
    </div>
  );
};

export default ContainedExample;
