import React from "react";
import { createRook } from "react-rooks";

const Locale = {
  EN: "en",
  FR: "fr",
} as const;

type LocaleType = (typeof Locale)[keyof typeof Locale];

// Contained store - each Rook instance has its own state
const [Rook, useRook] = createRook<{
  user: { id: number; name: string } | null;
  locale: LocaleType;
  title: string;
  messages: string[];
}>({
  defaultStore: {
    user: null,
    locale: Locale.EN,
    title: "Contained App",
    messages: [],
  },
});

const MessageManager = ({ instanceName }: { instanceName: string }) => {
  const [messages, setMessages] = useRook("messages");

  const addMessage = () => {
    const newMessage = `Message ${messages.length + 1} from ${instanceName}`;
    setMessages([...messages, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="demo-section">
      <h4>💬 Messages for {instanceName}</h4>
      <div className="demo-controls">
        <button className="demo-button" onClick={addMessage}>
          Add Message
        </button>
        <button className="demo-button secondary" onClick={clearMessages}>
          Clear
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
    setUser({ id: Date.now(), name: `User ${instanceName}` });
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <div className="demo-section">
      <h4>👤 User {instanceName}</h4>
      <div className="demo-controls">
        <button className="demo-button" onClick={loginUser}>
          Login
        </button>
        <button className="demo-button secondary" onClick={logoutUser}>
          Logout
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
        User: {user ? user.name : "Not logged in"}
        <br />
        Language: {locale.toUpperCase()}
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
        <strong>Contained Example:</strong> Each <code>&lt;Rook&gt;</code>{" "}
        component maintains its own independent state. Changes in one instance
        don't affect the others.
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
        💡 Notice that each instance maintains its own user state, language and
        messages. This is ideal for reusable components with their own state
        logic.
      </div>
    </div>
  );
};

export default ContainedExample;
