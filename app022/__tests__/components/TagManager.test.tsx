import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import TagManager from "../../app/components/TagManager";

describe("TagManager", () => {
  it("adds new tags via input submission", async () => {
    const user = userEvent.setup();
    const handleAdd = jest.fn();
    const handleRemove = jest.fn();

    render(
      <TagManager
        tags={["warm"]}
        suggestions={["warm", "cool"]}
        onAddTag={handleAdd}
        onRemoveTag={handleRemove}
      />,
    );

    expect(screen.getAllByText(/warm/i)).toHaveLength(2);

    await user.type(screen.getByPlaceholderText(/add tag/i), "vibrant{enter}");
    expect(handleAdd).toHaveBeenCalledWith("vibrant");
  });

  it("removes tags when delete button clicked", async () => {
    const user = userEvent.setup();
    const handleAdd = jest.fn();
    const handleRemove = jest.fn();

    render(
      <TagManager
        tags={["warm"]}
        suggestions={["warm", "cool"]}
        onAddTag={handleAdd}
        onRemoveTag={handleRemove}
      />,
    );

    await user.click(screen.getByRole("button", { name: /remove warm/i }));
    expect(handleRemove).toHaveBeenCalledWith("warm");
  });
});
