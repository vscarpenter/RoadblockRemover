type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

function createEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(JSON.stringify(createEntry("debug", message, context)));
  },

  info(message: string, context?: Record<string, unknown>): void {
    console.info(JSON.stringify(createEntry("info", message, context)));
  },

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(JSON.stringify(createEntry("warn", message, context)));
  },

  error(message: string, context?: Record<string, unknown>): void {
    console.error(JSON.stringify(createEntry("error", message, context)));
  },
} as const;
