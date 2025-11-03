import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import AITagSuggestion from "../../app/components/AITagSuggestion";

describe("AITagSuggestion", () => {
  it("lists AI tags and accepts selection", async () => {
    const onAccept = jest.fn();
    const user = userEvent.setup();

    render(<AITagSuggestion tags={["ocean", "twilight"]} onAcceptTag={onAccept} />);

    expect(screen.getByText(/ocean/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /"twilight" を追加/i }));
    expect(onAccept).toHaveBeenCalledWith("twilight");
  });
});
