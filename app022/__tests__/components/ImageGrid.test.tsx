import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import ImageGrid from "../../app/components/ImageGrid";
import type { ImageData } from "../../types";

const createImage = (id: string, name: string): ImageData => ({
  id,
  file: new Blob(),
  thumbnail: "data:image/png;base64,AAA",
  fileName: name,
  mimeType: "image/png",
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("ImageGrid", () => {
  it("renders images and forwards delete handler", async () => {
    const user = userEvent.setup();
    const handleDelete = jest.fn();
    const images = [createImage("1", "one.png"), createImage("2", "two.png")];

    render(<ImageGrid images={images} onDeleteImage={handleDelete} />);

    expect(screen.getByText("one.png")).toBeInTheDocument();
    expect(screen.getByText("two.png")).toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", { name: /delete image/i })[0],
    );
    expect(handleDelete).toHaveBeenCalledWith("1");
  });
});
