export function delayPromise(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, ms);
  });
}
