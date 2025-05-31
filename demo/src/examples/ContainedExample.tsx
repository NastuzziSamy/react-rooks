import { createRook } from "react-rooks";
import CodeTooltip from "../components/CodeTooltip";
import React from "react";

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

// Can be written using createStoreRook as well:
// const [Rook, useRook] = createStoreRook({
//   user: null as { id: number; name: string } | null,
//   locale: Locale.EN as LocaleType,
//   title: "Contained App",
//   messages: [] as string[],
// });

const MessageManager = ({ instanceName }: { instanceName: string }) => {
  // const [messages, setMessages] = [[], () => {}];
  const [messages, setMessages] = useRook("messages");
  const rerendersRef = React.useRef(0);

  rerendersRef.current += 1; // Track re-renders for demo purposes

  const messageCodeTooltip = `// Contained Store - Each Rook instance has its own state
const [Rook, useRook] = createRook({
  defaultStore: {
    user: null,
    locale: "en",
    title: "Contained App",
    messages: [],
  },
});

// Component using contained store
const MessageManager = ({ instanceName }) => {
  const [messages, setMessages] = useRook("messages");
  
  const addMessage = () => {
    const newMessage = \`Message \${messages.length + 1} from \${instanceName}\`;
    setMessages([...messages, newMessage]);
  };
  
  // Each Rook instance maintains its own independent state
  return <div>Messages: {messages.length}</div>;
};`;

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
      <CodeTooltip code={messageCodeTooltip} />
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
      <div className="demo-info">
        <strong>Re-renders:</strong> {rerendersRef.current} times
      </div>
    </div>
  );
};

const InstanceManager = ({ instanceName }: { instanceName: string }) => {
  const [store, updateStore] = useRook();
  const rerendersRef = React.useRef(0);

  rerendersRef.current += 1; // Track re-renders for demo purposes

  const instanceCodeTooltip = `// Each Rook instance maintains separate state
const InstanceManager = ({ instanceName }) => {
  const [user, setUser] = useRook("user");
  const [locale, setLocale] = useRook("locale");
  
  // Actions only affect THIS instance's state
  const loginUser = () => {
    setUser({ id: Date.now(), name: \`User \${instanceName}\` });
  };
  
  // State is completely isolated between instances
  return (
    <div>
      Instance: {instanceName}
      User: {user ? user.name : "Not logged in"}
      Locale: {locale}
    </div>
  );
};

// Usage with multiple isolated instances:
<Rook key="instance1"><InstanceManager instanceName="A" /></Rook>
<Rook key="instance2"><InstanceManager instanceName="B" /></Rook>`;

  const loginUser = () => {
    updateStore({ user: { id: Date.now(), name: `User ${instanceName}` } });
  };

  const logoutUser = () => {
    updateStore({ user: null });
  };

  return (
    <div className="demo-section">
      <h4>👤 User {instanceName}</h4>
      <CodeTooltip code={instanceCodeTooltip} />
      <div className="demo-controls">
        <button
          className={"demo-button" + (store.user ? " secondary" : "")}
          onClick={loginUser}
        >
          Login
        </button>
        <button
          className={"demo-button" + (store.user ? "" : " secondary")}
          onClick={logoutUser}
        >
          Logout
        </button>
        <div className="locale-buttons">
          <button
            className={`locale-button ${
              store.locale === Locale.EN ? "active" : ""
            }`}
            onClick={() => updateStore({ locale: Locale.EN })}
          >
            EN
          </button>
          <button
            className={`locale-button ${
              store.locale === Locale.FR ? "active" : ""
            }`}
            onClick={() => updateStore({ locale: Locale.FR })}
          >
            FR
          </button>
        </div>
      </div>
      <div className="demo-state">
        User: {store.user?.name ?? "Not logged in"}
        <br />
        Language: {store.locale.toUpperCase()}
      </div>
      <div className="demo-info">
        <strong>Re-renders:</strong> {rerendersRef.current} times
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
