import "@testing-library/jest-dom/vitest";

// React 18+ testing requires this global flag for act() and state updates.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
