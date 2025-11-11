import "@testing-library/jest-dom";
import "fake-indexeddb/auto";
import structuredClone from "@ungap/structured-clone";

if (typeof globalThis.structuredClone !== "function") {
  (globalThis as unknown as { structuredClone: typeof structuredClone }).structuredClone = structuredClone;
}
