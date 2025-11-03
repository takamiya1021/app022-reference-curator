import { act } from "@testing-library/react";
import { useImageStore } from "../../store/useImageStore";

describe("useImageStore", () => {
  it("should add images into state", async () => {
    const mockImage = {
      id: "test-image",
      file: new Blob(),
      thumbnail: "data:image/png;base64,AAA",
      fileName: "test.png",
      mimeType: "image/png",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await act(async () => {
      await useImageStore.getState().addImage(mockImage);
    });

    expect(useImageStore.getState().images[0]?.id).toBe("test-image");
  });
});
