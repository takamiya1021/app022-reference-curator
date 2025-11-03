import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import ImageDetailModal from "../../app/components/ImageDetailModal";
import type { ImageData } from "../../types";

describe("ImageDetailModal", () => {
  const image: ImageData = {
    id: "img-1",
    file: new Blob(),
    thumbnail: "data:image/png;base64,AAA",
    fileName: "detail.png",
    mimeType: "image/png",
    tags: ["sunset"],
    memo: "Warm tones",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  };

  it("renders image details and memo", () => {
    render(
      <ImageDetailModal
        image={image}
        isOpen
        onClose={() => {}}
        onUpdateMemo={jest.fn()}
        onAcceptTags={jest.fn()}
        aiSuggestions={[]}
      />,
    );

    expect(screen.getByRole("heading", { name: /detail\.png/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue(/warm tones/i)).toBeInTheDocument();
  });

  it("saves memo changes", async () => {
    const onUpdateMemo = jest.fn();
    const user = userEvent.setup();

    render(
      <ImageDetailModal
        image={image}
        isOpen
        onClose={() => {}}
        onUpdateMemo={onUpdateMemo}
        onAcceptTags={jest.fn()}
        aiSuggestions={[]}
      />,
    );

    await user.clear(screen.getByLabelText(/メモ/i));
    await user.type(screen.getByLabelText(/メモ/i), "Calm sea");
    await user.click(screen.getByRole("button", { name: /保存/i }));

    expect(onUpdateMemo).toHaveBeenCalledWith("img-1", "Calm sea");
  });

  it("applies AI tag suggestions", async () => {
    const onAcceptTags = jest.fn();
    const user = userEvent.setup();

    render(
      <ImageDetailModal
        image={image}
        isOpen
        onClose={() => {}}
        onUpdateMemo={jest.fn()}
        onAcceptTags={onAcceptTags}
        aiSuggestions={["ocean", "twilight"]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /"ocean" を追加/i }));
    expect(onAcceptTags).toHaveBeenCalledWith("img-1", "ocean");
  });

  it("closes modal via button", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(
      <ImageDetailModal
        image={image}
        isOpen
        onClose={onClose}
        onUpdateMemo={jest.fn()}
        onAcceptTags={jest.fn()}
        aiSuggestions={[]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /閉じる/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
