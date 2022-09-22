import test from 'ava'
import bufferCount from '../lib/bufferCount.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test('bufferCount', async t => {
    let values = []
    interval(10)
        .pipe(take(7), bufferCount(3))
        .subscribe({
            next(value) {
                values.push(value)
            },
        })
    await clock.runAllAsync()
    t.deepEqual(values, [[0, 1, 2], [3, 4, 5], [6]])

    values = []
    interval(10)
        .pipe(take(7), bufferCount(3, 2))
        .subscribe({
            next(value) {
                values.push(value)
            },
        })
    await clock.runAllAsync()
    t.deepEqual(values, [[0, 1, 2], [2, 3, 4], [4, 5, 6], [6]])
})
