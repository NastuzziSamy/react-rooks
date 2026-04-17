import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import * as React from "react";
import { z } from "zod";

import { createZodRook } from "../src/create-zod";

describe("createZodRook", () => {
  const schema = z.object({
    count: z.number().default(0),
    name: z.string().default("init"),
  });

  it("initializes with the schema's defaults", async () => {
    const [Rook, useRook] = createZodRook(schema);

    const Component = () => {
      const [count] = useRook("count");
      const [name] = useRook("name");
      return (
        <div>
          <span data-testid="count">{count}</span>
          <span data-testid="name">{name}</span>
        </div>
      );
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("0");
      expect(screen.getByTestId("name")).toHaveTextContent("init");
    });
  });

  it("validates updates and calls onValidationError on failure", async () => {
    const onValidationError = vi.fn();
    const [Rook, useRook] = createZodRook(schema, { onValidationError });

    const Component = () => {
      const [name, setName] = useRook("name");
      return (
        <div>
          <span data-testid="name">{name}</span>
          <button
            data-testid="bad"
            onClick={() => setName(42 as unknown as string)}
          >
            bad
          </button>
          <button data-testid="good" onClick={() => setName("ok")}>
            good
          </button>
        </div>
      );
    };

    render(
      <Rook>
        <Component />
      </Rook>
    );

    const bad = await screen.findByTestId("bad");
    await act(async () => {
      bad.click();
    });

    await waitFor(() => expect(onValidationError).toHaveBeenCalled());
    expect(screen.getByTestId("name")).toHaveTextContent("init");

    await act(async () => {
      screen.getByTestId("good").click();
    });

    await waitFor(() =>
      expect(screen.getByTestId("name")).toHaveTextContent("ok")
    );
  });
});
