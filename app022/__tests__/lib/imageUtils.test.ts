import imageCompression from "browser-image-compression";
import { generateThumbnail } from "../../lib/imageUtils";

type MockedImageCompression = jest.Mock & {
  getDataUrlFromFile: jest.Mock;
};

jest.mock("browser-image-compression", () => {
  const mock = jest.fn(async (file: File) => file) as MockedImageCompression;
  mock.getDataUrlFromFile = jest.fn(async () => "data:image/png;base64,MOCK");
  return {
    __esModule: true,
    default: mock,
  };
});

describe("generateThumbnail", () => {
  it("returns a base64 data URL thumbnail", async () => {
    const file = new File([new Uint8Array([137, 80, 78, 71])], "thumb.png", {
      type: "image/png",
    });

    const thumbnail = await generateThumbnail(file);

    expect(imageCompression).toHaveBeenCalled();
    expect((imageCompression as MockedImageCompression).getDataUrlFromFile).toHaveBeenCalled();
    expect(thumbnail).toBe("data:image/png;base64,MOCK");
  });
});
