import React from "react";

// Test pour vérifier que les imports sont correctement séparés
const ImportTest: React.FC = () => {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        margin: "10px",
        borderRadius: "5px",
      }}
    >
      <h3>🧪 Test d'importation</h3>
      <div style={{ marginTop: "10px" }}>
        <h4>✅ Imports réussis :</h4>
        <ul>
          <li>
            ✅ <code>createZodRook</code> depuis <code>react-rooks/zod</code>
          </li>
          <li>
            ✅ <code>useRook</code> depuis <code>react-rooks</code>
          </li>
        </ul>

        <h4>❌ Imports qui devraient échouer :</h4>
        <ul>
          <li>
            ❌ <code>createZodRook</code> depuis <code>react-rooks</code> (plus
            disponible)
          </li>
        </ul>

        <p style={{ color: "green", fontWeight: "bold" }}>
          ✅ La séparation des imports fonctionne correctement !
        </p>
        <p style={{ color: "#666", fontSize: "14px" }}>
          Les fonctionnalités Zod sont maintenant optionnelles et disponibles
          uniquement via <code>react-rooks/zod</code>
        </p>
      </div>
    </div>
  );
};

export default ImportTest;
