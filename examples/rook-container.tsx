import React from "react";
import { createRook, RookContainer } from "react-rooks";

// Store hiérarchique: User → Theme → Cart
const [UserStore, useUser] = createRook({
  defaultStore: {
    id: 1,
    name: "Alice",
    role: "admin",
    isLoggedIn: true,
  },
});

const [ThemeStore, useTheme] = createRook({
  defaultStore: {
    mode: "light" as "light" | "dark",
    primaryColor: "#3b82f6",
    fontSize: 16,
  },
});

const [CartStore, useCart] = createRook({
  defaultStore: {
    items: [] as Array<{ id: number; name: string; price: number }>,
    total: 0,
  },
});

// Composant qui consomme les 3 stores
function SmartComponent() {
  const [user] = useUser("name");
  const [isLoggedIn] = useUser("isLoggedIn");
  const [mode] = useTheme("mode");
  const [primaryColor] = useTheme("primaryColor");
  const [items, setItems] = useCart("items");
  const [total, setTotal] = useCart("total");

  const addItem = () => {
    if (!isLoggedIn) {
      console.log("Utilisateur non connecté!");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: `Article ${items.length + 1}`,
      price: Math.floor(Math.random() * 50) + 10,
    };

    const newItems = [...items, newItem];
    const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);

    setItems(newItems);
    setTotal(newTotal);
  };

  return (
    <div
      style={{
        backgroundColor: mode === "dark" ? "#1f2937" : "#f9fafb",
        color: mode === "dark" ? "#f9fafb" : "#1f2937",
        border: `2px solid ${primaryColor}`,
        padding: "20px",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>🛒 Panier Intelligent</h2>
      <p>
        <strong>Utilisateur:</strong> {user} ({isLoggedIn ? "✅" : "❌"})
      </p>
      <p>
        <strong>Thème:</strong> {mode}
      </p>
      <p>
        <strong>Articles:</strong> {items.length}
      </p>
      <p>
        <strong>Total:</strong> ${total.toFixed(2)}
      </p>

      <button
        onClick={addItem}
        disabled={!isLoggedIn}
        style={{
          backgroundColor: primaryColor,
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          cursor: isLoggedIn ? "pointer" : "not-allowed",
          opacity: isLoggedIn ? 1 : 0.5,
        }}
      >
        Ajouter un Article
      </button>

      {items.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <h4>Articles dans le panier:</h4>
          {items.map((item) => (
            <div key={item.id}>
              {item.name} - ${item.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Exemple d'utilisation correcte
function CorrectExample() {
  return (
    <div>
      <h1>✅ Ordre Correct</h1>
      <p>UserStore → ThemeStore → CartStore</p>
      <RookContainer rooks={[UserStore, ThemeStore, CartStore]}>
        <SmartComponent />
      </RookContainer>
    </div>
  );
}

// Exemple d'ordre incorrect (commenté car cela causerait des erreurs)
/*
function WrongExample() {
  return (
    <div>
      <h1>❌ Ordre Incorrect</h1>
      <p>CartStore → UserStore → ThemeStore</p>
      <RookContainer rooks={[CartStore, UserStore, ThemeStore]}>
        <SmartComponent />
      </RookContainer>
    </div>
  );
}
*/

export default function RookContainerExample() {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>🏗️ Exemple RookContainer</h1>
      <p>
        Cet exemple montre l'importance de l'ordre des stores dans
        RookContainer. Le composant SmartComponent consomme des données des
        trois stores.
      </p>

      <div style={{ marginBottom: "30px" }}>
        <h2>🔄 Ordre des Stores</h2>
        <p>
          <strong>Règle:</strong> Les composants peuvent seulement accéder aux
          stores qui sont positionnés au-dessus d'eux dans le tableau.
        </p>
        <ul>
          <li>✅ UserStore (niveau 1)</li>
          <li>✅ ThemeStore (niveau 2, peut accéder à UserStore)</li>
          <li>
            ✅ CartStore (niveau 3, peut accéder à UserStore + ThemeStore)
          </li>
        </ul>
      </div>

      <CorrectExample />

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#fef3c7",
          borderRadius: "8px",
        }}
      >
        <h3>💡 Bonnes Pratiques</h3>
        <ol>
          <li>Placez les stores fondamentaux (auth, user) en premier</li>
          <li>Ajoutez les stores de configuration (theme, settings) ensuite</li>
          <li>Terminez par les stores spécifiques aux fonctionnalités</li>
        </ol>
      </div>
    </div>
  );
}
