export const noop = () => {};

export function createPromise(): [() => void, Promise<undefined>] {
  let resolve;
  const p = new Promise<undefined>((res) => {
    resolve = res;
  });
  return [resolve, p];
}
