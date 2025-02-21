import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App.tsx";

describe("App", () => {
  test("renders", () => {
    render(<App />);
    expect(screen.getByText("Currency Swap Form")).toBeDefined();
  });
});
