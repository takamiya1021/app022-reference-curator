import imageCompression, {
  getDataUrlFromFile,
} from "browser-image-compression";
import { generateThumbnail } from "../../lib/imageUtils";

jest.mock("browser-image-compression", () => ({
  __esModule: true,
  default: jest.fn(async (file: File) => file),
  getDataUrlFromFile: jest.fn(async () => "data:image/png;base64,MOCK"),
}));

describe("generateThumbnail", () => {
  it("returns a base64 data URL thumbnail", async () => {
    const file = new File([new Uint8Array([137, 80, 78, 71])], "thumb.png", {
      type: "image/png",
    });

    const thumbnail = await generateThumbnail(file);

    expect(imageCompression).toHaveBeenCalled();
    expect(getDataUrlFromFile).toHaveBeenCalled();
    expect(thumbnail).toBe("data:image/png;base64,MOCK");
  });
});
