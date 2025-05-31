import React from "react";
import { createZodRook } from "../../../index-zod";
import { z } from "zod";
import CodeTooltip from "../components/CodeTooltip";

// Schéma simple pour tester
const CounterSchema = z.object({
  count: z.number().default(0),
  name: z.string().default("Counter"),
});

const [CounterRook, useCounter] = createZodRook({
  schema: CounterSchema,
  onValidationError: (error) => console.error("Validation error:", error),
});

const SimpleZodExample: React.FC = () => {
  const [counter, updateCounter] = useCounter();

  const simpleZodCodeTooltip = `// Simple Zod Schema with createZodRook
const CounterSchema = z.object({
  count: z.number().default(0),
  name: z.string().default("Counter"),
});

const [CounterRook, useCounter] = createZodRook({
  schema: CounterSchema,
  onValidationError: (error) => console.error("Validation error:", error),
});

// Usage in component
const SimpleZodExample = () => {
  const [counter, updateCounter] = useCounter();
  
  // All updates are validated against Zod schema
  const increment = () => {
    updateCounter({ count: counter.count + 1 }); // ✅ Valid number
  };
  
  const invalidUpdate = () => {
    updateCounter({ count: "invalid" }); // ❌ Validation error!
  };
  
  return (
    <div>
      <p>Count: {counter.count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};`;

  return (
    <CounterRook>
      <div className="p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Simple Zod Example</h2>
        <CodeTooltip code={simpleZodCodeTooltip} />
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {counter.name}
          </div>
          <div>
            <strong>Count:</strong> {counter.count}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => updateCounter({ count: counter.count + 1 })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Increment
            </button>
            <button
              onClick={() => updateCounter({ count: counter.count - 1 })}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Decrement
            </button>
            <button
              onClick={() => updateCounter({ count: 0 })}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </CounterRook>
  );
};

export default SimpleZodExample;
