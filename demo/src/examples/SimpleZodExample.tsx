import React from "react";
import { createZodRook } from "react-rooks/zod";
import { z } from "zod";

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

  return (
    <CounterRook>
      <div className="p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Simple Zod Example</h2>
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
