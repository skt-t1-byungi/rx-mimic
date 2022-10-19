import test from 'ava'
import bufferTime from '../lib/bufferTime.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import FakerTimers from '@sinonjs/fake-timers'

const clock = FakerTimers.install()
test.after(() => clock.uninstall())

test.serial('bufferTime', async t => {
    const values = []
    interval(2)
        .pipe(take(10), bufferTime(5))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [
        [0, 1],
        [2, 3, 4],
        [5, 6],
        [7, 8, 9],
    ])
})

test.serial('creationInterval', async t => {
    const values = []
    interval(2)
        .pipe(take(3), bufferTime(3, 2))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [[0], [0, 1], [1, 2], [2]])
})

test.serial('limit buffer size', async t => {
    const values = []
    interval(2)
        .pipe(take(5), bufferTime(5, null, 2))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [[0, 1], [2, 3], [4]])
})
