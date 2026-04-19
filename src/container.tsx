import * as React from "react";
import { RookContainerProps } from "./type";

export const RookContainer = ({ rooks, children }: RookContainerProps) => {
  let contained = children;

  // Reverse on a copy — mutating the rooks prop would corrupt the caller's
  // array and break subsequent renders.
  for (const Rook of [...rooks].reverse()) {
    contained = <Rook>{contained}</Rook>;
  }

  return <>{contained}</>;
};

export default RookContainer;
