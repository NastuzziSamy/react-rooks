import * as React from "react";
import { RookComponent, RookContainerProps } from "./type";

export const RookContainer = ({ rooks, children }: RookContainerProps) => {
  let contained = children;

  rooks.reverse().forEach((Rook: RookComponent) => {
    contained = <Rook>{contained}</Rook>;
  });

  return contained;
};

export default RookContainer;
