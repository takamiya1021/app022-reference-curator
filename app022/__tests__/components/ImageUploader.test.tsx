import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import ImageUploader from "../../app/components/ImageUploader";

describe("ImageUploader", () => {
  it("invokes callback when files are selected", async () => {
    const user = userEvent.setup();
    const handleFiles = jest.fn();
    render(<ImageUploader onFilesAdded={handleFiles} />);

    const fileInput = screen.getByLabelText(/add images/i);
    const file = new File(["dummy"], "example.png", { type: "image/png" });

    await user.upload(fileInput, file);

    expect(handleFiles).toHaveBeenCalledTimes(1);
    expect(handleFiles).toHaveBeenCalledWith([file]);
  });
});
