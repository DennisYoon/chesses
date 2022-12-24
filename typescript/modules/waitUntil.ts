export function waitUntil(condition: () => boolean) {
  return new Promise(res => {
    const interval = setInterval(() => {
      if (condition()) {
        res(null);
        clearInterval(interval);
      }
    }, 100);
  });
}

// Thanks to https://stackoverflow.com/questions/52184291/async-await-with-setinterval
// I love you, Zhora and mdikici