import "@testing-library/jest-dom";
import "fake-indexeddb/auto";
import structuredClone from "@ungap/structured-clone";

if (typeof globalThis.structuredClone !== "function") {
  // @ts-expect-error - we are polyfilling structuredClone for the test env.
  globalThis.structuredClone = structuredClone;
}
