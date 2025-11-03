import { act } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Slideshow from "../../app/components/Slideshow";
import type { ImageData } from "../../types";

const createImage = (overrides: Partial<ImageData> = {}): ImageData => ({
  id: crypto.randomUUID(),
  file: new Blob(),
  thumbnail: "data:image/png;base64,AAA",
  fileName: "slide.png",
  mimeType: "image/png",
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const mockImages = [
  createImage({ id: "a", fileName: "first.png" }),
  createImage({ id: "b", fileName: "second.png" }),
  createImage({ id: "c", fileName: "third.png" }),
];

describe("Slideshow", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(document, "exitFullscreen", {
      configurable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });

    Object.defineProperty(HTMLElement.prototype, "requestFullscreen", {
      configurable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    delete (document as unknown as { exitFullscreen?: () => Promise<void> }).exitFullscreen;
    delete (HTMLElement.prototype as unknown as { requestFullscreen?: () => Promise<void> })
      .requestFullscreen;
  });

  it("auto advances slides and exposes progress indicator", async () => {
    render(<Slideshow images={mockImages} isOpen onClose={() => {}} interval={3} />);

    expect(screen.getByRole("img", { name: /first\.png/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/slide progress/i)).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByRole("img", { name: /second\.png/i })).toBeInTheDocument();
  });

  it("supports manual navigation via buttons and arrow keys", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Slideshow images={mockImages} isOpen onClose={() => {}} interval={5} />);

    await user.click(screen.getByRole("button", { name: /next image/i }));
    expect(screen.getByRole("img", { name: /second\.png/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous image/i }));
    expect(screen.getByRole("img", { name: /first\.png/i })).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("img", { name: /second\.png/i })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("img", { name: /first\.png/i })).toBeInTheDocument();
  });

  it("exits slideshow when close is triggered", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { rerender } = render(
      <Slideshow images={mockImages} isOpen onClose={onClose} interval={5} />,
    );

    await user.click(screen.getByRole("button", { name: /close slideshow/i }));
    expect(onClose).toHaveBeenCalled();

    rerender(<Slideshow images={mockImages} isOpen={false} onClose={onClose} interval={5} />);
    expect(screen.queryByRole("img", { name: /first\.png/i })).not.toBeInTheDocument();
  });
});
