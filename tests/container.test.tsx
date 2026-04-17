import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import * as React from "react";

import { RookContainer } from "../src/container";
import { createStoreRook } from "../src/create";
import type { RookComponent } from "../src/type";

describe("RookContainer", () => {
  it("renders children inside all rooks so every hook has its provider", async () => {
    const [RookA, useA] = createStoreRook({ a: 1 });
    const [RookB, useB] = createStoreRook({ b: 2 });

    const Child = () => {
      const [a] = useA("a");
      const [b] = useB("b");
      return <div data-testid="values">{`${a}-${b}`}</div>;
    };

    render(
      <RookContainer rooks={[RookA, RookB]}>
        <Child />
      </RookContainer>
    );

    await waitFor(() =>
      expect(screen.getByTestId("values")).toHaveTextContent("1-2")
    );
  });

  it("does not mutate the rooks prop", () => {
    const [RookA] = createStoreRook({ a: 1 });
    const [RookB] = createStoreRook({ b: 2 });
    const [RookC] = createStoreRook({ c: 3 });

    const rooks: RookComponent[] = [RookA, RookB, RookC];
    const snapshot = [...rooks];

    render(
      <RookContainer rooks={rooks}>
        <div />
      </RookContainer>
    );

    // Previously the container reversed the array in place, corrupting the
    // caller's list and breaking subsequent renders or re-use.
    expect(rooks).toEqual(snapshot);
  });
});
