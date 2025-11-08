import { createImagesFromFiles } from "../../lib/imageFactory";
import { generateThumbnail } from "../../lib/imageUtils";

jest.mock("../../lib/imageUtils", () => ({
  generateThumbnail: jest.fn(async () => "data:image/png;base64,MOCK"),
}));

describe("createImagesFromFiles", () => {
  it("converts files into ImageData structures", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "demo.png", { type: "image/png" });

    const [image] = await createImagesFromFiles([file]);

    expect(generateThumbnail).toHaveBeenCalledWith(file);
    expect(image.fileName).toBe("demo.png");
    expect(image.mimeType).toBe("image/png");
    expect(image.thumbnail).toBe("data:image/png;base64,MOCK");
    expect(image.tags).toEqual([]);
  });
});
