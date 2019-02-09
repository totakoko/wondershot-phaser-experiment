import * as _ from '@/util'

describe('util', () => {
  it('#debounce()', async () => {
    const recorder = []
    const func = _.debounce((a, b) => recorder.push([a, b]), 50)
    func(1, 2)
    func(3, 4)
    func(5, 6)
    await _.sleep(100)
    func(7, 8)
    func(9, 10)
    await _.sleep(100)
    expect(recorder).toEqual([
      [5, 6],
      [9, 10]
    ])
  })
  it('#throttle()', async () => {
    const recorder = []
    const func = _.throttle((a, b) => recorder.push([a, b]), 50)
    func(1, 2)
    func(3, 4)
    func(5, 6)
    await _.sleep(100)
    func(7, 8)
    func(9, 10)
    await _.sleep(100)
    expect(recorder).toEqual([
      [1, 2],
      [7, 8]
    ])
  })
})
