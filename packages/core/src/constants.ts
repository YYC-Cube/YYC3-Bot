export const BRAND = {
  name: "YanYuCloudCube",
  shortName: "YYC\u00B3",
  sloganCn: "\u8A00\u542F\u8C61\u9650 \xB7 \u8BED\u67A2\u672A\u6765",
  sloganEn: "Words Initiate Quadrants, Language Serves as Core for Future",
  email: "admin@0379.email",
  established: 2025,
  copyright: "\u00A9 2025-2026 YYC\u00B3 Team. All Rights Reserved.",
} as const

export const PHILOSOPHY = {
  highs: {
    label: "\u4E94\u9AD8\u67B6\u6784",
    items: ["\u9AD8\u53EF\u7528", "\u9AD8\u6027\u80FD", "\u9AD8\u5B89\u5168", "\u9AD8\u6269\u5C55", "\u9AD8\u667A\u80FD"],
  },
  standards: {
    label: "\u4E94\u6807\u4F53\u7CFB",
    items: ["\u6807\u51C6\u5316", "\u89C4\u8303\u5316", "\u81EA\u52A8\u5316", "\u53EF\u89C6\u5316", "\u667A\u80FD\u5316"],
  },
  transforms: {
    label: "\u4E94\u5316\u8F6C\u578B",
    items: ["\u6D41\u7A0B\u5316", "\u6570\u5B57\u5316", "\u751F\u6001\u5316", "\u5DE5\u5177\u5316", "\u670D\u52A1\u5316"],
  },
  dimensions: {
    label: "\u4E94\u7EF4\u8BC4\u4F30",
    items: ["\u65F6\u95F4\u7EF4", "\u7A7A\u95F4\u7EF4", "\u5C5E\u6027\u7EF4", "\u4E8B\u4EF6\u7EF4", "\u5173\u8054\u7EF4"],
  },
} as const

export const PROJECT_CATEGORIES = [
  { id: "ai-application", label: "AI \u5E94\u7528", icon: "\uD83E\uDD16" },
  { id: "ai-llm", label: "AI \u5927\u6A21\u578B", icon: "\uD83E\uDDDE" },
  { id: "ai-platform", label: "AI \u5E73\u53F0", icon: "\u2699\uFE0F" },
  { id: "education", label: "\u6559\u80B2", icon: "\uD83D\uDCDA" },
  { id: "medical", label: "\u533B\u7597", icon: "\uD83C\uDFE5" },
  { id: "management", label: "\u7BA1\u7406", icon: "\uD83D\uDCBB" },
  { id: "tools", label: "\u5DE5\u5177", icon: "\uD83D\uDD27" },
  { id: "entertainment", label: "\u5A31\u4E50", icon: "\uD83C\uDFB5" },
  { id: "infrastructure", label: "\u57FA\u7840\u8BBE\u65BD", icon: "\u2601\uFE0F" },
] as const
