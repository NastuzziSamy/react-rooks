import React, { useState } from "react";
import "./App.css";

// Import des exemples
import ClassicExample from "./examples/ClassicExample";
import ContainedExample from "./examples/ContainedExample";
import ReducedExample from "./examples/ReducedExample";
import ZodExample from "./examples/ZodExample";

const examples = [
  {
    id: "classic",
    title: "Exemple Classique",
    description: "Utilisation basique de createRook avec store global",
    component: ClassicExample,
  },
  {
    id: "contained",
    title: "Exemple Contenu",
    description: "Store avec scope limité aux composants enfants",
    component: ContainedExample,
  },
  {
    id: "reduced",
    title: "Exemple avec Reducers",
    description: "Utilisation de createRook avec reducers et logique métier",
    component: ReducedExample,
  },
  {
    id: "zod",
    title: "Exemple avec Zod",
    description: "Validation de schéma avec createSchemedRook",
    component: ZodExample,
  },
];

function App() {
  const [selectedExample, setSelectedExample] = useState(examples[0]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 React Rooks - Démo Interactive</h1>
        <p>Testez facilement les différents exemples de React Rooks</p>
      </header>

      <div className="app-content">
        <nav className="sidebar">
          <h2>Exemples</h2>
          <ul className="example-list">
            {examples.map((example) => (
              <li key={example.id}>
                <button
                  className={`example-button ${
                    selectedExample.id === example.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedExample(example)}
                >
                  <div className="example-title">{example.title}</div>
                  <div className="example-description">
                    {example.description}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="main-content">
          <div className="example-header">
            <h2>{selectedExample.title}</h2>
            <p>{selectedExample.description}</p>
          </div>

          <div className="example-container">
            {(() => {
              const Component = selectedExample.component;
              return <Component />;
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
