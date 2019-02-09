export function getRandomNumber (min, max) {
  return Math.random() * (max - min) + min
}

export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce (func, wait) {
  let lastThis
  let lastArgs
  let timerId
  function wrapper (...args) {
    lastThis = this
    lastArgs = args
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(invoke, wait)
  }
  function invoke () {
    timerId = null
    func.apply(lastThis, lastArgs)
  }
  return wrapper
}

export function throttle (func, wait) {
  let wasCalledRecently = false
  function wrapper (...args) {
    if (!wasCalledRecently) {
      wasCalledRecently = true
      func.apply(this, args)
      setTimeout(() => {
        wasCalledRecently = false
      }, wait)
    }
  }
  return wrapper
}
