// firestoreCache.test.js
import { describe, it, expect } from "vitest";
import {
  toGrams,
  getWeightTolerance,
  normalizeCut,
  isValidForm,
} from "./firestoreCache";

describe("toGrams()", () => {
  it("converts various units to grams", () => {
    expect(toGrams(1, "g")).toBeCloseTo(1);
    expect(toGrams(1, "kg")).toBeCloseTo(1000);
    expect(toGrams(1, "oz")).toBeCloseTo(28.3495);
    expect(toGrams(1, "lbs")).toBeCloseTo(453.592);
  });
});

describe("getWeightTolerance()", () => {
  it("returns correct tolerance for weight ranges", () => {
    expect(getWeightTolerance(300)).toBe(10);
    expect(getWeightTolerance(800)).toBe(25);
    expect(getWeightTolerance(1200)).toBe(50);
  });
});

describe("normalizeCut()", () => {
  it("returns lowercased named cut", () => {
    expect(normalizeCut({ cut: "Ribeye" })).toBe("ribeye");
  });

  it('returns custom cut when "Other" is selected', () => {
    expect(normalizeCut({ cut: "Other", customCut: "Tomahawk " })).toBe(
      "tomahawk"
    );
  });
});

describe("isValidForm()", () => {
  it("returns true for valid form data", () => {
    const form = {
      surface: "Stove",
      tempStyle: "Knob",
      weightValue: "300",
      weightUnit: "g",
      cut: "Ribeye",
      customCut: "",
      doneness: "Medium",
      pan: "Cast Iron",
    };
    expect(isValidForm(form)).toBe(true);
  });

  it("returns false if any field is missing", () => {
    const form = {
      surface: "",
      tempStyle: "Knob",
      weightValue: "300",
      weightUnit: "g",
      cut: "Ribeye",
      customCut: "",
      doneness: "Medium",
      pan: "Cast Iron",
    };
    expect(isValidForm(form)).toBe(false);
  });

  it("returns false if weight is not a number", () => {
    const form = {
      surface: "Stove",
      tempStyle: "Knob",
      weightValue: "abc",
      weightUnit: "g",
      cut: "Ribeye",
      customCut: "",
      doneness: "Medium",
      pan: "Cast Iron",
    };
    expect(isValidForm(form)).toBe(false);
  });
});
