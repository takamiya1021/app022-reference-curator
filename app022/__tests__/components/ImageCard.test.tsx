import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import ImageCard from "../../app/components/ImageCard";
import type { ImageData } from "../../types";

const createImage = (overrides: Partial<ImageData> = {}): ImageData => ({
  id: "img-1",
  file: new Blob(),
  thumbnail: "data:image/png;base64,AAA",
  fileName: "sample.png",
  mimeType: "image/png",
  tags: ["warm", "modern"],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("ImageCard", () => {
  it("shows image info and triggers delete", async () => {
    const user = userEvent.setup();
    const handleDelete = jest.fn();
    const image = createImage();

    render(<ImageCard image={image} onDelete={handleDelete} />);

    expect(screen.getByText(image.fileName)).toBeInTheDocument();
    expect(screen.getByText(/warm/i)).toBeInTheDocument();
    expect(screen.getByText(/modern/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete image/i }));
    expect(handleDelete).toHaveBeenCalledWith(image.id);
  });
});
