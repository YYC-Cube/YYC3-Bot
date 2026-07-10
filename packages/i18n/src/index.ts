/**
 * file index.ts
 * description @yyc3/i18n-core 模块入口
 * module @yyc3/i18n-core
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.4.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [config]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief @yyc3/i18n-core 模块入口
 */
// Core Engine
export { I18nEngine, SUPPORTED_LOCALES, i18n, isSupportedLocale, t } from "./lib/engine";
export type { I18nEngineConfig } from "./lib/engine";

// Cache System
export { LRUCache } from "./lib/cache";
export type { CacheConfig, CacheStats } from "./lib/cache";

// Plugin System
export { PluginManager } from "./lib/plugins";
export type { I18nContext, I18nPlugin } from "./lib/plugins";

// Built-in Plugins (from plugins/index.ts)
export {
  MissingKeyReporter,
  PerformanceTracker, createConsoleLogger
} from "./lib/plugins/index";

// Formatter utilities
export { formatRelativeTime, interpolate, pluralize } from "./lib/formatter";
export type { TranslateParams } from "./lib/formatter";

// Locale detection
export {
  detectSystemLocale, isChineseLocale, normalizeLocale
} from "./lib/detector";
export type { LocaleDetectionResult } from "./lib/detector";

// RTL Utilities
export {
  RTL_LOCALES, createMirroredLayout, flipSpacing, getAlignment, getDirection, getOppositeAlignment, isRTL, mirrorPosition, setupDocumentDirection, transformClassForRTL
} from "./lib/rtl-utils";

// Core Types
export type { HorizontalAlignment, Locale, RTLLocale, SpacingProperty, TextDirection, TranslationMap } from "./lib/types";

// ============================================================
// MCP Server (Model Context Protocol - AI Agent Integration)
// ============================================================

export { registerI18nTools } from "./lib/mcp/i18n-tools";
export { MCPServer } from "./lib/mcp/server";
export type { ToolHandler } from "./lib/mcp/server";
export type {
  MCPMessage, MCPResource, MCPServerCapabilities, MCPServerConfig,
  MCPServerInfo, MCPTool, MCPToolResult, MCPTransport
} from "./lib/mcp/types";

// ============================================================
// AI Enhancement Layer (LLM-Powered Translation)
// ============================================================

export { AIProviderManager } from "./lib/ai/provider";
export type {
  AIProvider, AIProviderConfig, AIProviderInfo, AIProviderType, TranslationRequest,
  TranslationResponse
} from "./lib/ai/provider";

export { QualityEstimator } from "./lib/ai/quality-estimator";
export type {
  QEContext, QEIssue,
  QEResult,
  QERule, QESeverity
} from "./lib/ai/quality-estimator";

export { OllamaProvider } from "./lib/ai/ollama-provider";
export { OpenAIProvider } from "./lib/ai/openai-provider";

// ============================================================
// ICU MessageFormat Engine (Based on Unicode ICU Specification)
// ============================================================

export { ICUCompiler } from "./lib/icu/compiler";
export type { ICUCompileContext } from "./lib/icu/compiler";
export { ICUParser } from "./lib/icu/parser";
export type { ICUArgument, ICUDate, ICULiteral, ICUNode, ICUNumber, ICUParseError, ICUParseResult, ICUPlural, ICUPluralClause, ICUSelect, ICUSelectClause, ICUSelectOrdinal, ICUTime } from "./lib/icu/types";

// ============================================================
// MCP Transport Layer
// ============================================================

// StdioTransport uses node:stream - import from "@yyc3/i18n/stdio-transport" for server use
// export { StdioTransport } from "./lib/mcp/stdio-transport";

// ============================================================
// CLI Tools (AST Analysis & Chinese Detection)
// ============================================================

export { ChineseDetector } from "./lib/cli/chinese-detector";
export type { DetectionResult } from "./lib/cli/chinese-detector";

// ============================================================
// Infrastructure Utilities (from FAmily π³ - High Availability)
// ============================================================

// Backoff & Retry
export {
  DEFAULT_BACKOFF_POLICY, computeBackoff, createRetryRunner, sleepWithAbort
} from "./lib/infra/backoff";
export type { BackoffPolicy } from "./lib/infra/backoff";

// Rate Limiting
export { createFixedWindowRateLimiter } from "./lib/infra/rate-limit";
export type { FixedWindowRateLimiter } from "./lib/infra/rate-limit";

// Logger
export { createLogger, getLogLevel, logger, setLogLevel } from "./lib/infra/logger";
export type { LogLevel, Logger } from "./lib/infra/logger";

// Secure Random
// Uses node:crypto - import from "@yyc3/i18n/secure-random" for server use
// export { generateSecureFraction, ... } from "./lib/infra/secure-random";

// ============================================================
// Security Utilities (from FAmily π³ - Enterprise Security)
// ============================================================

// Dangerous Operations Detection
export {
  DANGEROUS_OPERATIONS_SET, DANGEROUS_OPERATION_NAMES, getDangerousOperations, isDangerousOperation
} from "./lib/security/dangerous-operations";
export type { DangerousOperation } from "./lib/security/dangerous-operations";

// Safe Regex (ReDoS Protection)
export {
  clearSafeRegexCache, compileSafeRegex,
  testSafeRegex
} from "./lib/security/safe-regex";
export type { SafeRegexCompileResult, SafeRegexRejectReason } from "./lib/security/safe-regex";

// Secret Comparison (Timing Attack Safe)
export { safeEqualSecret } from "./lib/security/secret-equal";

// ============================================================
// General Utilities (from FAmily π³ - Production Ready)
// ============================================================

// Time Formatting
export { formatRelativeTimestamp, formatTimeAgo } from "./lib/utils/format-time";
export type { FormatRelativeTimestampOptions, FormatTimeAgoOptions } from "./lib/utils/format-time";

// Path Guards (Traversal Prevention) - uses node:path
// Import from "@yyc3/i18n/path-guards" for server use
// export { hasNodeErrorCode, ... } from "./lib/utils/path-guards";

// JSON File Operations - uses node:fs
// Import from "@yyc3/i18n/json-file" for server use
// export { deleteJsonFile, ... } from "./lib/utils/json-file";
