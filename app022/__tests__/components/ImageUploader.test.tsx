import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

  it("shows error for unsupported file types", async () => {
    const user = userEvent.setup();
    render(<ImageUploader />);

    const fileInput = screen.getByLabelText(/add images/i);
    const file = new File(["text"], "note.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(await screen.findByTestId("uploader-error")).toHaveTextContent(/対応していない画像形式です/i);
    expect(mockAddImages).not.toHaveBeenCalled();
  });

  it("shows error when file exceeds size limit", async () => {
    const user = userEvent.setup();
    render(<ImageUploader />);

    const fileInput = screen.getByLabelText(/add images/i);
    const largeFile = new File([new ArrayBuffer(10 * 1024 * 1024)], "large.png", { type: "image/png" });
    Object.defineProperty(largeFile, "size", { value: 11 * 1024 * 1024 });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(await screen.findByTestId("uploader-error")).toHaveTextContent(/10MB/);
    expect(mockAddImages).not.toHaveBeenCalled();
  });

  it("shows quota error when IndexedDB is full", async () => {
    mockAddImages.mockRejectedValueOnce(new Error("QuotaExceededError"));
    const user = userEvent.setup();
    render(<ImageUploader />);

    const fileInput = screen.getByLabelText(/add images/i);
    const file = new File(["content"], "quota.png", { type: "image/png" });

    await user.upload(fileInput, file);

    expect(await screen.findByTestId("uploader-error")).toHaveTextContent(/ストレージ容量が不足/);
  });
});
