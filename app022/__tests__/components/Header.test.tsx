import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Header from "../../app/components/Header";

describe("Header", () => {
  it("renders brand title and calls handlers", async () => {
    const user = userEvent.setup();
    const onOpenUploader = jest.fn();
    const onStartSlideshow = jest.fn();
    const onOpenSettings = jest.fn();

    render(
      <Header
        onOpenUploader={onOpenUploader}
        onStartSlideshow={onStartSlideshow}
        onOpenSettings={onOpenSettings}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /reference curator/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add images/i }));
    expect(onOpenUploader).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /start slideshow/i }));
    expect(onStartSlideshow).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });
});
