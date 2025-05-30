import React, { useState } from "react";
import "./App.css";

// Import des exemples
import ClassicExample from "./examples/ClassicExample";
import ContainedExample from "./examples/ContainedExample";
import ReducedExample from "./examples/ReducedExample";
import ZodExample from "./examples/ZodExample";
import ZodRookExample from "./examples/ZodRookExample";
import DefaultValuesExample from "./examples/DefaultValuesExample";
import RookContainerExample from "./examples/RookContainerExample";
import SimpleZodExample from "./examples/SimpleZodExample";
import ZodWithInitExample from "./examples/ZodWithInitExample";
import ImportTest from "./components/ImportTest";

const examples = [
  {
    id: "classic",
    title: "Classic Example",
    description: "Basic usage of createRook with global store",
    component: ClassicExample,
  },
  {
    id: "contained",
    title: "Contained Example",
    description: "Store with scope limited to child components",
    component: ContainedExample,
  },
  {
    id: "rook-container",
    title: "RookContainer Example",
    description: "Multiple stores with RookContainer and order importance",
    component: RookContainerExample,
  },
  {
    id: "reduced",
    title: "Example with Reducers",
    description: "Usage of createRook with reducers and business logic",
    component: ReducedExample,
  },
  {
    id: "zod",
    title: "Example with Zod",
    description: "Schema validation with createSchemedRook",
    component: ZodExample,
  },
  {
    id: "zod-rook",
    title: "createZodRook Example",
    description: "Automatic Zod validation with createZodRook hook",
    component: ZodRookExample,
  },
  {
    id: "default-values",
    title: "Default Values Test",
    description: "Test automatic default values from Zod schema",
    component: DefaultValuesExample,
  },
  {
    id: "simple-zod",
    title: "Simple Zod Example",
    description: "Basic usage of react-rooks/zod import",
    component: SimpleZodExample,
  },
  {
    id: "zod-with-init",
    title: "Zod with Init Function",
    description: "Using createZodRook with async initialization",
    component: ZodWithInitExample,
  },
];

function App() {
  const [selectedExample, setSelectedExample] = useState(examples[0]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 React Rooks - Interactive Demo</h1>
        <p>Easily test different React Rooks examples</p>
      </header>

      <div className="app-content">
        <nav className="sidebar">
          <h2>Examples</h2>
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
