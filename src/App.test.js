import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the Maison storefront", async () => {
  render(<App />);

  expect(
    screen.getByRole("link", { name: /maison/i })
  ).toBeInTheDocument();

  expect(
    screen.getByText(/the beauty/i)
  ).toBeInTheDocument();

  expect(
    screen.getByText(/categories/i)
  ).toBeInTheDocument();
});