import React, { useState } from "react";
import { createZodRook } from "../../../index-zod";
import { z } from "zod";
import CodeTooltip from "../components/CodeTooltip";

// Schéma de validation pour différents types de données
const ValidationSchema = z.object({
  //   email: z.string().min(1, "Email requis").email("Email invalide").nullable(),
  //   phone: z.string().min(1, "Téléphone requis").nullable(),
  //   password: z.string().min(8, "Mot de passe trop court").nullable(),
  validationResults: z
    .object({
      email: z.boolean().default(false),
      phone: z.boolean().default(false),
      password: z.boolean().default(false),
    })
    .default({ email: false, phone: false, password: false }),
});

// Création du Rook avec validation Zod
const [ValidationRook, useValidation] = createZodRook(ValidationSchema, {
  onValidationError: (error) => console.error("Validation error:", error),
});

// Composant pour valider l'email
const EmailValidator = () => {
  const [data, updateData] = useValidation();
  const [error, setError] = useState<string | null>(null);

  const emailSchema = z.string().email("Adresse email invalide");

  const validateEmail = (value: string) => {
    if (!value) {
      setError(null);
      updateData({
        email: value,
        validationResults: { ...data.validationResults, email: "empty" },
      });
      return;
    }

    try {
      emailSchema.parse(value);
      setError(null);
      updateData({
        email: value,
        validationResults: { ...data.validationResults, email: "valid" },
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
        updateData({
          email: value,
          validationResults: { ...data.validationResults, email: "invalid" },
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateEmail(e.target.value);
  };

  const getInputClass = () => {
    if (data.validationResults.email === "valid") return "border-green-500";
    if (data.validationResults.email === "invalid") return "border-red-500";
    return "border-gray-300";
  };

  return (
    <div className="validation-field">
      <label htmlFor="email" className="block font-semibold mb-2">
        Email :
      </label>
      <input
        id="email"
        type="email"
        value={data.email}
        onChange={handleChange}
        placeholder="exemple@email.com"
        className={`w-full p-3 border-2 rounded-md ${getInputClass()}`}
      />
      {error && <span className="text-red-500 text-sm mt-1">❌ {error}</span>}
      {data.validationResults.email === "valid" && (
        <span className="text-green-500 text-sm mt-1">✅ Email valide</span>
      )}
    </div>
  );
};

// Composant pour valider le téléphone
const PhoneValidator = () => {
  const [data, updateData] = useValidation();
  const [error, setError] = useState<string | null>(null);

  const phoneSchema = z
    .string()
    .regex(
      /^(\+33|0)[1-9](\d{8})$/,
      "Numéro de téléphone français invalide (ex: 0123456789 ou +33123456789)"
    );

  const validatePhone = (value: string) => {
    if (!value) {
      setError(null);
      updateData({
        phone: value,
        validationResults: { ...data.validationResults, phone: "empty" },
      });
      return;
    }

    try {
      phoneSchema.parse(value);
      setError(null);
      updateData({
        phone: value,
        validationResults: { ...data.validationResults, phone: "valid" },
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
        updateData({
          phone: value,
          validationResults: { ...data.validationResults, phone: "invalid" },
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validatePhone(e.target.value);
  };

  const getInputClass = () => {
    if (data.validationResults.phone === "valid") return "border-green-500";
    if (data.validationResults.phone === "invalid") return "border-red-500";
    return "border-gray-300";
  };

  return (
    <div className="validation-field">
      <label htmlFor="phone" className="block font-semibold mb-2">
        Téléphone :
      </label>
      <input
        id="phone"
        type="tel"
        value={data.phone}
        onChange={handleChange}
        placeholder="0123456789 ou +33123456789"
        className={`w-full p-3 border-2 rounded-md ${getInputClass()}`}
      />
      {error && <span className="text-red-500 text-sm mt-1">❌ {error}</span>}
      {data.validationResults.phone === "valid" && (
        <span className="text-green-500 text-sm mt-1">✅ Téléphone valide</span>
      )}
    </div>
  );
};

// Composant pour valider le mot de passe
const PasswordValidator = () => {
  const [data, updateData] = useValidation();
  const [error, setError] = useState<string | null>(null);

  const passwordSchema = z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
    );

  const validatePassword = (value: string) => {
    if (!value) {
      setError(null);
      updateData({
        password: value,
        validationResults: { ...data.validationResults, password: "empty" },
      });
      return;
    }

    try {
      passwordSchema.parse(value);
      setError(null);
      updateData({
        password: value,
        validationResults: { ...data.validationResults, password: "valid" },
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
        updateData({
          password: value,
          validationResults: { ...data.validationResults, password: "invalid" },
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validatePassword(e.target.value);
  };

  const getInputClass = () => {
    if (data.validationResults.password === "valid") return "border-green-500";
    if (data.validationResults.password === "invalid") return "border-red-500";
    return "border-gray-300";
  };

  return (
    <div className="validation-field">
      <label htmlFor="password" className="block font-semibold mb-2">
        Mot de passe :
      </label>
      <input
        id="password"
        type="password"
        value={data.password}
        onChange={handleChange}
        placeholder="Au moins 8 caractères avec maj, min et chiffre"
        className={`w-full p-3 border-2 rounded-md ${getInputClass()}`}
      />
      {error && <span className="text-red-500 text-sm mt-1">❌ {error}</span>}
      {data.validationResults.password === "valid" && (
        <span className="text-green-500 text-sm mt-1">
          ✅ Mot de passe valide
        </span>
      )}
    </div>
  );
};

// Composant principal
const ZodDataValidationExample: React.FC = () => {
  const [data] = useValidation();
  console.log("Validation data:", data);

  const validCount = Object.values(data.validationResults).filter(
    (state) => state === "valid"
  ).length;
  const totalFields = Object.values(data.validationResults).filter(
    (state) => state !== "empty"
  ).length;

  const validationCodeExample = `// Schémas de validation Zod
const emailSchema = z.string().email("Adresse email invalide");
const phoneSchema = z.string().regex(
  /^(\\+33|0)[1-9](\\d{8})$/,
  "Numéro français invalide"
);
const passwordSchema = z.string()
  .min(8, "Au moins 8 caractères")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/, "Maj, min et chiffre requis");

// Utilisation avec createZodRook
const [ValidationRook, useValidation] = createZodRook({
  schema: ValidationSchema,
  onValidationError: (error) => console.error(error),
});`;

  return (
    <ValidationRook>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Démo de validation de données avec Zod
        </h2>
        <p className="mb-6 text-gray-600">
          Cette démo montre comment utiliser Zod avec react-rooks pour valider
          différents types de données en temps réel.
        </p>

        {totalFields > 0 && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Résumé des validations</h3>
            <p className="mb-2">
              <strong>
                {validCount}/{totalFields}
              </strong>{" "}
              champs valides
            </p>
            <div className="w-full h-3 bg-gray-300 rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  validCount === totalFields ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{
                  width:
                    totalFields > 0
                      ? `${(validCount / totalFields) * 100}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <EmailValidator />
          <PhoneValidator />
          <PasswordValidator />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            Fonctionnalités démontrées :
          </h3>
          <ul className="space-y-1 text-sm">
            <li>✅ Validation d'email avec Zod</li>
            <li>✅ Validation de numéro de téléphone français</li>
            <li>✅ Validation de mot de passe complexe</li>
            <li>✅ Feedback visuel en temps réel</li>
            <li>✅ Synchronisation avec le store global</li>
            <li>✅ Gestion d'état des validations</li>
          </ul>
        </div>

        <CodeTooltip code={validationCodeExample}>
          💻 Voir le code des schémas de validation
        </CodeTooltip>
      </div>
    </ValidationRook>
  );
};

export default ZodDataValidationExample;
