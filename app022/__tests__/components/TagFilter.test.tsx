import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import TagFilter from "../../app/components/TagFilter";

describe("TagFilter", () => {
  it("toggles tag selection", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <TagFilter
        tags={[
          { name: "warm", count: 3 },
          { name: "cool", count: 1 },
        ]}
        selected={["warm"]}
        onChange={handleChange}
      />,
    );

    const coolCheckbox = screen.getByRole("checkbox", { name: /cool/i });
    expect(coolCheckbox).not.toBeChecked();

    await user.click(coolCheckbox);
    expect(handleChange).toHaveBeenCalledWith(["warm", "cool"]);
  });
});
