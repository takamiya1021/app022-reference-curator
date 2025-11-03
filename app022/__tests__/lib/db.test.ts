import { initDB } from "../../lib/db";

describe("initDB", () => {
  it("should expose images and tags tables", async () => {
    const db = await initDB();
    expect(db.images).toBeDefined();
    expect(db.tags).toBeDefined();
  });
});
