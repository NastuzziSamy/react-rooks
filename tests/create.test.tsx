import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";

import { createRook, createStoreRook } from "../src/create";

type Counter = {
  count: number;
  label: string;
};

const Display: React.FC<{ useRook: any }> = ({ useRook }) => {
  const [count] = useRook("count");
  const [label] = useRook("label");
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="label">{label}</span>
    </div>
  );
};

describe("createStoreRook", () => {
  it("initializes with defaultStore and exposes values via the hook", async () => {
    const [Rook, useRook] = createStoreRook<Counter>({
      count: 0,
      label: "init",
    });

    render(
      <Rook>
        <Display useRook={useRook} />
      </Rook>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("0");
      expect(screen.getByTestId("label")).toHaveTextContent("init");
    });
  });

  it("updates a single key via the setter", async () => {
    const [Rook, useRook] = createStoreRook<Counter>({
      count: 0,
      label: "init",
    });

    const Component = () => {
      const [count, setCount] = useRook("count");
      return (
        <button data-testid="btn" onClick={() => setCount(count + 1)}>
          {count}
        </button>
      );
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    const btn = await screen.findByTestId("btn");
    expect(btn).toHaveTextContent("0");

    await act(async () => {
      btn.click();
    });

    await waitFor(() => expect(btn).toHaveTextContent("1"));
  });

  it("supports functional updates that read the latest value", async () => {
    const [Rook, useRook] = createStoreRook<Counter>({
      count: 0,
      label: "init",
    });

    const Component = () => {
      const [count, setCount] = useRook("count");
      const handle = () => {
        // Three rapid updates must all compose off the latest value, proving
        // the setter does not close over a stale snapshot.
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
      };
      return (
        <button data-testid="btn" onClick={handle}>
          {count}
        </button>
      );
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    const btn = await screen.findByTestId("btn");
    await act(async () => {
      btn.click();
    });

    await waitFor(() => expect(btn).toHaveTextContent("3"));
  });

  it("applies per-key reducers", async () => {
    const reducer = vi.fn((newValue: number, oldValue: number) =>
      newValue < 0 ? oldValue : newValue
    );

    const [Rook, useRook] = createStoreRook<Counter>(
      { count: 0, label: "init" },
      {
        reducers: {
          count: reducer,
        },
      }
    );

    const Component = () => {
      const [count, setCount] = useRook("count");
      return (
        <div>
          <span data-testid="count">{count}</span>
          <button data-testid="up" onClick={() => setCount(count + 5)}>
            up
          </button>
          <button data-testid="bad" onClick={() => setCount(-10)}>
            bad
          </button>
        </div>
      );
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    const count = await screen.findByTestId("count");
    await act(async () => {
      screen.getByTestId("up").click();
    });
    await waitFor(() => expect(count).toHaveTextContent("5"));

    await act(async () => {
      screen.getByTestId("bad").click();
    });
    await waitFor(() => expect(count).toHaveTextContent("5"));

    expect(reducer).toHaveBeenCalled();
  });

  it("applies a storeReducer across multiple keys", async () => {
    const [Rook, useRook] = createStoreRook<Counter>(
      { count: 0, label: "init" },
      {
        storeReducer: (values, store) => {
          if (values.count !== undefined && values.count > store.count) {
            return { ...values, label: "up" };
          }
          return values;
        },
      }
    );

    const Component = () => {
      const [, setCount] = useRook("count");
      const [label] = useRook("label");
      return (
        <div>
          <span data-testid="label">{label}</span>
          <button data-testid="btn" onClick={() => setCount(1)}>
            go
          </button>
        </div>
      );
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    const labelEl = await screen.findByTestId("label");
    expect(labelEl).toHaveTextContent("init");

    await act(async () => {
      screen.getByTestId("btn").click();
    });

    await waitFor(() => expect(labelEl).toHaveTextContent("up"));
  });

  it("returns the full store when no key is passed", async () => {
    const [Rook, useRook] = createStoreRook<Counter>({
      count: 42,
      label: "hi",
    });

    const Component = () => {
      const [store] = useRook();
      return <span data-testid="store">{JSON.stringify(store)}</span>;
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    await waitFor(() =>
      expect(screen.getByTestId("store")).toHaveTextContent(
        JSON.stringify({ count: 42, label: "hi" })
      )
    );
  });

  it("does not mutate the values object the caller originally passed", async () => {
    // Capture the exact values object that storeReducer was handed along
    // with a snapshot of its contents at call time. Configure a per-key
    // reducer too: the historical bug was `nextValues[name] = ...` inside
    // the per-key loop, which mutated the object storeReducer had returned.
    const captured: Array<{
      ref: Partial<Counter>;
      snapshot: Partial<Counter>;
    }> = [];
    const storeReducer = vi.fn((values: Partial<Counter>) => {
      captured.push({ ref: values, snapshot: { ...values } });
      return values;
    });
    const perKeyReducer = vi.fn((value: number) => value * 2);

    const [Rook, useRook] = createStoreRook<Counter>(
      { count: 0, label: "init" },
      {
        storeReducer,
        reducers: {
          count: perKeyReducer,
        },
      }
    );

    const Component = () => {
      const [, setCount] = useRook("count");
      return (
        <button data-testid="btn" onClick={() => setCount(1)}>
          go
        </button>
      );
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    const btn = await screen.findByTestId("btn");
    await act(async () => {
      btn.click();
    });
    await act(async () => {
      btn.click();
    });

    await waitFor(() => expect(perKeyReducer).toHaveBeenCalled());

    // Each object we saw must still hold the exact values it had at the
    // moment storeReducer returned it. If the per-key reducer loop mutated
    // the returned object in place, `count` would no longer be 1 but the
    // post-reduction value (2).
    expect(captured.length).toBeGreaterThan(0);
    for (const { ref, snapshot } of captured) {
      expect(ref).toEqual(snapshot);
    }
  });
});

describe("createRook", () => {
  it("runs async init and exposes the resulting store", async () => {
    type Store = { ready: boolean; n: number };

    const [Rook, useRook] = createRook<Store, Store>({
      defaultStore: { ready: false, n: 0 },
      init: async (defaults) => ({
        ...defaults,
        ready: true,
        n: 7,
      }),
    });

    const Component = () => {
      const [ready] = useRook("ready");
      const [n] = useRook("n");
      return (
        <div>
          <span data-testid="ready">{String(ready)}</span>
          <span data-testid="n">{n}</span>
        </div>
      );
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    await waitFor(() => {
      expect(screen.getByTestId("ready")).toHaveTextContent("true");
      expect(screen.getByTestId("n")).toHaveTextContent("7");
    });
  });

  it("supports async reducers and serialises concurrent updates", async () => {
    type Store = { n: number };

    // An async reducer that resolves after a short delay — previously this
    // raced with itself and dropped concurrent increments.
    const [Rook, useRook] = createStoreRook<Store>(
      { n: 0 },
      {
        reducers: {
          n: async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 5));
            return newValue;
          },
        },
      }
    );

    const Component = () => {
      const [n, setN] = useRook("n");
      return (
        <button
          data-testid="btn"
          onClick={() => {
            setN((prev) => prev + 1);
            setN((prev) => prev + 1);
            setN((prev) => prev + 1);
          }}
        >
          {n}
        </button>
      );
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    const btn = await screen.findByTestId("btn");
    await act(async () => {
      btn.click();
    });

    await waitFor(() => expect(btn).toHaveTextContent("3"), {
      timeout: 1000,
    });
  });
});
