import React from "react";
import { useState } from "react";
import "./App.css";

// Import des exemples
import ClassicExample from "./examples/ClassicExample";
import ContainedExample from "./examples/ContainedExample";
import ReducedExample from "./examples/ReducedExample";
// import ZodRookExample from "./examples/ZodRookExample";
import RookContainerExample from "./examples/RookContainerExample";
// import ZodDataValidationExample from "./examples/ZodDataValidationExample";
import RookIcon from "./components/RookIcon";

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
  // {
  //   id: "zod-rook",
  //   title: "createZodRook Example",
  //   description: "Automatic Zod validation with createZodRook hook",
  //   component: ZodRookExample,
  // },
  // {
  //   id: "zod-data-validation",
  //   title: "Zod Data Validation",
  //   description: "Real-time validation of various data types with Zod",
  //   component: ZodDataValidationExample,
  // },
];

function App() {
  const [selectedExample, setSelectedExample] = useState(examples[0]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <RookIcon
            width={64}
            height={64}
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginRight: "0.5rem",
            }}
          />
          React Rooks - Interactive Demo
        </h1>
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
