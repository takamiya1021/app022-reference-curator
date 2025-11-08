import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import ImageUploader from "../../app/components/ImageUploader";

const mockAddImages = jest.fn();
const mockCreateImagesFromFiles = jest.fn(async (files: File[]) =>
  files.map((file) => ({
    id: "mock-id",
    file,
    thumbnail: "data:image/png;base64,MOCK",
    fileName: file.name,
    mimeType: file.type,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
);

jest.mock("@/store/useImageStore", () => ({
  useImageStore: (selector: (state: { addImages: typeof mockAddImages }) => typeof mockAddImages) =>
    selector({ addImages: mockAddImages }),
}));

jest.mock("@/lib/imageFactory", () => ({
  createImagesFromFiles: (...args: Parameters<typeof mockCreateImagesFromFiles>) =>
    mockCreateImagesFromFiles(...args),
}));

describe("ImageUploader", () => {
  beforeEach(() => {
    mockAddImages.mockReset();
    mockCreateImagesFromFiles.mockClear();
  });

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

  it("imports files via addImages", async () => {
    const user = userEvent.setup();
    render(<ImageUploader />);

    const fileInput = screen.getByLabelText(/add images/i);
    const file = new File(["content"], "bulk.png", { type: "image/png" });

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(mockCreateImagesFromFiles).toHaveBeenCalled();
      expect(mockAddImages).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ fileName: "bulk.png" }),
      ]));
    });
  });
});
