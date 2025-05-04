/**
 * Utility function to retry an async operation with exponential backoff.
 */

// Options for the retry mechanism
interface RetryOptions {
    retries?: number;        // Maximum number of retry attempts
    initialDelayMs?: number; // Initial delay in milliseconds
    backoffFactor?: number;  // Factor to multiply delay by for each retry (e.g., 2 for exponential)
    onRetry?: (error: Error, attempt: number) => void; // Optional callback on each retry
}

// Default options
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
    retries: 8,             // Increased retries to handle longer potential waits (e.g., 429 errors)
    initialDelayMs: 1000,
    backoffFactor: 2,
    onRetry: (error, attempt) => console.warn(`  Retry attempt ${attempt} failed: ${error.message}`),
};

/**
 * Retries an asynchronous operation with exponential backoff.
 *
 * @param operation The async function to retry.
 * @param options Configuration for the retry behavior.
 * @returns A promise that resolves with the result of the operation if successful.
 * @throws The last error encountered if all retries fail.
 */
export async function retryAsyncOperation<T>(
    operation: () => Promise<T>,
    options?: RetryOptions
): Promise<T> {
    const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: Error | undefined;
    let delayMs = config.initialDelayMs;

    for (let attempt = 0; attempt <= config.retries; attempt++) {
        try {
            return await operation(); // Attempt the operation
        } catch (error: any) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < config.retries) {
                if (config.onRetry) {
                    config.onRetry(lastError, attempt + 1);
                }
                const waitTime = delayMs;
                console.log(`    Waiting ${waitTime}ms before next retry...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                delayMs *= config.backoffFactor; // Increase delay for next time
            } else {
                console.error(`  All ${config.retries + 1} attempts failed.`);
                // No more retries left, throw the last error
                throw lastError;
            }
        }
    }
    // This line should technically be unreachable, but satisfies TypeScript
    throw lastError || new Error('Retry loop finished unexpectedly');
} 