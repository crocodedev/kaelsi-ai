export function throttleByInterval<A extends any[], R>(
  fn: (...args: A) => Promise<R> | R,
  intervalMs: number
) {
  let nextAvailableAt = 0;
  let chain: Promise<void> = Promise.resolve();

  const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

  async function acquireSlot() {
    const now = Date.now();
    const wait = Math.max(0, nextAvailableAt - now);
    if (wait > 0) {
      await delay(wait);
    }
    nextAvailableAt = Date.now() + intervalMs;
  }

  return async (...args: A): Promise<R> => {
    const task = chain.then(acquireSlot);
    chain = task.catch(() => {});
    await task;
    return await fn(...args);
  };
}


