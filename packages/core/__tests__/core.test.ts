import { describe, it, expect } from "vitest"
import { cn } from "../src/cn"
import { BRAND, PHILOSOPHY, PROJECT_CATEGORIES } from "../src/constants"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "active")).toBe("base active")
  })

  it("deduplicates tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end")
  })

  it("returns empty string for no args", () => {
    expect(cn()).toBe("")
  })
})

describe("BRAND", () => {
  it("has required fields", () => {
    expect(BRAND.name).toBe("YanYuCloudCube")
    expect(BRAND.shortName).toBe("YYC³")
    expect(BRAND.email).toContain("@")
    expect(BRAND.copyright).toContain("YYC³")
  })
})

describe("PHILOSOPHY", () => {
  it("has 4 dimensions", () => {
    expect(PHILOSOPHY.highs.items).toHaveLength(5)
    expect(PHILOSOPHY.standards.items).toHaveLength(5)
    expect(PHILOSOPHY.transforms.items).toHaveLength(5)
    expect(PHILOSOPHY.dimensions.items).toHaveLength(5)
  })

  it("each dimension has label and items", () => {
    const dims = [PHILOSOPHY.highs, PHILOSOPHY.standards, PHILOSOPHY.transforms, PHILOSOPHY.dimensions]
    for (const dim of dims) {
      expect(dim.label).toBeTruthy()
      expect(dim.items.length).toBeGreaterThan(0)
    }
  })
})

describe("PROJECT_CATEGORIES", () => {
  it("has categories", () => {
    expect(PROJECT_CATEGORIES.length).toBeGreaterThan(0)
  })

  it("each category has required fields", () => {
    for (const cat of PROJECT_CATEGORIES) {
      expect(cat.id).toBeTruthy()
      expect(cat.label).toBeTruthy()
      expect(cat.icon).toBeTruthy()
    }
  })
})
