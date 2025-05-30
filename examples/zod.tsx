import * as React from "react";
import { createZodRook } from "react-rooks/zod";
import { z } from "zod";

// Some global/stored values.
export const [Rook, useRook] = createZodRook(
  z.object({
    user: z
      .object({
        id: z.string().optional(),
        name: z.string(),
      })
      .optional(),
    locale: z.enum(["en", "fr"]).default("en"),
    title: z.string().default("My React app"),
  })
);

export const ChangeLocale = () => {
  const [locale, setLocale] = useRook("locale");

  React.useEffect(() => setTimeout(() => setLocale("fr"), 2500), []);

  return null;
};

export const ShowLocale = () => {
  const [locale] = useRook("locale");

  // Log: 'en'.
  // After 2.5s, log: 'fr'.
  console.log(locale);

  return null;
};

export const App = () => (
  <Rook>
    <ChangeLocale />
    <ShowLocale />
  </Rook>
);

export default App;
