export interface ImageData {
  id: string;
  file: Blob;
  thumbnail: string;
  fileName: string;
  mimeType: string;
  tags: string[];
  memo?: string;
  aiDescription?: string;
  aiTags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
  createdAt: Date;
}

export interface AppSettings {
  geminiApiKey?: string;
  slideshowInterval: number;
  thumbnailSize: number;
  gridColumns: number;
}
