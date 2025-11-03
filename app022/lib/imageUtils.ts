import imageCompression, {
  getDataUrlFromFile,
} from "browser-image-compression";

const THUMBNAIL_MAX_WIDTH = 320;
const THUMBNAIL_MAX_HEIGHT = 320;
const THUMBNAIL_MAX_SIZE_MB = 0.2;

export const generateThumbnail = async (file: File): Promise<string> => {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: Math.max(THUMBNAIL_MAX_WIDTH, THUMBNAIL_MAX_HEIGHT),
    maxSizeMB: THUMBNAIL_MAX_SIZE_MB,
    useWebWorker: true,
    fileType: file.type,
  });

  return getDataUrlFromFile(compressed);
};
