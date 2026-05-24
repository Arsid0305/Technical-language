import { describe, it, expect } from "vitest";

describe("glossary key normalisation", () => {
  const normalise = (word: string) => word.toLowerCase().trim();

  it("lower-cases the key", () => {
    expect(normalise("API")).toBe("api");
  });

  it("strips surrounding whitespace", () => {
    expect(normalise("  fetch  ")).toBe("fetch");
  });

  it("handles mixed case + spaces", () => {
    expect(normalise("  TypeScript  ")).toBe("typescript");
  });
});
