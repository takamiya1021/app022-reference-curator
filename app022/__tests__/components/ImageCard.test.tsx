import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";
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
  let observers: Array<(entries: IntersectionObserverEntry[]) => void> = [];

  beforeEach(() => {
    observers = [];
    const observe = jest.fn();
    const unobserve = jest.fn();
    const disconnect = jest.fn();

    // @ts-expect-error - jsdom lacks IntersectionObserver, so we polyfill for tests.
    global.IntersectionObserver = jest.fn((callback) => {
      observers.push(callback);
      return { observe, unobserve, disconnect };
    });
  });

  afterEach(() => {
    // @ts-expect-error - cleanup polyfill
    delete global.IntersectionObserver;
  });

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

  it("lazy loads image thumbnail when intersecting", () => {
    const image = createImage();

    render(<ImageCard image={image} onDelete={jest.fn()} />);

    const img = screen.getByRole("img", { name: image.fileName });
    expect(img).toHaveAttribute("data-loaded", "false");

    act(() => {
      observers.forEach((callback) =>
        callback([
          {
            isIntersecting: true,
            intersectionRatio: 1,
          } as IntersectionObserverEntry,
        ]),
      );
    });

    expect(img).toHaveAttribute("data-loaded", "true");
  });
});
