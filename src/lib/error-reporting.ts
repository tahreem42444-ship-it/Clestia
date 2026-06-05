type ErrorReportingOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

/**
 * Reports an error to any globally registered error capture hook.
 * Swap the implementation here to plug in Sentry, Datadog, or any other provider.
 */
export function reportError(
  error: unknown,
  context: Record<string, unknown> = {},
  _options: ErrorReportingOptions = {},
) {
  if (typeof window === "undefined") return;

  // Log to console in all environments so nothing is silently swallowed.
  console.error("[error-reporting]", error, context);

  // Optional: forward to a global hook if one is registered (e.g. Sentry shim).
  // (window as any).__errorCapture?.({ error, context, options: _options });
}
