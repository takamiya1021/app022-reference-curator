import ImageCard from "../../app/components/ImageCard";

describe("ImageCard memoization", () => {
  it("exports a memoized component", () => {
    expect(ImageCard.$$typeof).toBe(Symbol.for("react.memo"));
  });
});
