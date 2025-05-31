import React, { useState } from "react";

interface CodeTooltipProps {
  code: string;
  children?: React.ReactNode;
  className?: string;
}

const CodeTooltip: React.FC<CodeTooltipProps> = ({
  code,
  children = "💻",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div
      className={`code-tooltip-container ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {isVisible && (
        <div className="code-tooltip-content">
          <div className="code-tooltip-header">
            <span className="code-tooltip-title">Code React Rook</span>
            <button
              className="code-tooltip-copy-btn"
              onClick={handleCopy}
              title="Copier le code"
            >
              {isCopied ? "✅ Copié" : "📋 Copier"}
            </button>
          </div>
          <div className="code-tooltip-arrow" />
          <pre
            style={{
              margin: 0,
              padding: 0,
              fontSize: "inherit",
              fontFamily: "inherit",
              lineHeight: "inherit",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            <code style={{ color: "#e5e5e5" }}>{code}</code>
          </pre>
        </div>
      )}

      <div
        className="code-tooltip-trigger"
        onClick={handleCopy}
        title={isCopied ? "Copié !" : "Cliquer pour copier le code"}
      >
        {isCopied ? "✅" : children}
      </div>
    </div>
  );
};

export default CodeTooltip;
