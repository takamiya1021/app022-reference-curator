import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

describe("Home page", () => {
  it("should render Reference Curator heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /reference curator/i }),
    ).toBeInTheDocument();
  });
});
