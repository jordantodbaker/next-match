/**
 * Detects transient database *connection* failures — chiefly Neon's serverless
 * compute cold-starting after auto-suspend, which surfaces as
 * `PrismaClientInitializationError` / error code `P1001`
 * ("Can't reach database server"). These occur before the query executes, so
 * retrying is safe for reads and writes alike.
 */
export function isTransientDbError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const err = e as { name?: string; code?: string; message?: string };
  return (
    err.name === "PrismaClientInitializationError" ||
    err.code === "P1001" ||
    /can't reach database server/i.test(err.message ?? "")
  );
}

/**
 * Runs an operation, retrying only on transient connection failures with
 * exponential backoff (default 0.4s, 0.8s, 1.6s). Gives a sleeping Neon
 * database time to wake so the cold-start blip never surfaces as a 500.
 * Non-transient errors (and the final attempt) are rethrown immediately.
 */
export async function withDbRetry<T>(
  op: () => Promise<T>,
  { attempts = 3, baseDelayMs = 400 }: { attempts?: number; baseDelayMs?: number } = {}
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await op();
    } catch (e) {
      lastErr = e;
      if (attempt === attempts - 1 || !isTransientDbError(e)) throw e;
      await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** attempt));
    }
  }
  throw lastErr;
}
