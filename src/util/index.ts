export function getRandomNumber (min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function getRandomInteger (min: number, max: number): number {
  return Math.floor(getRandomNumber(min, max))
}

export async function sleep (ms: number): Promise<void> {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

export function throttle (func: any, wait: number) {
  let wasCalledRecently = false
  function wrapper (...args: any[]) {
    if (!wasCalledRecently) {
      wasCalledRecently = true
      func(...args)
      setTimeout(() => {
        wasCalledRecently = false
      }, wait)
    }
  }
  return wrapper
}

// Durstenfeld shuffle algorithm
export function shuffleArray<T> (array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function radiansToDegrees (rad: number): number {
  return rad * (180 / Math.PI)
}
