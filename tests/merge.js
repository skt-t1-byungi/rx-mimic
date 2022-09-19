import test from 'ava'
import merge from '../lib/merge.js'
import timer from '../lib/timer.js'
import concat from '../lib/concat.js'
import mapTo from '../lib/mapTo.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

const testSource = [
    concat(timer(100), timer(50)),
    concat(timer(0), timer(200)),
    concat(timer(50), timer(50)),
].map((src, i) => src.pipe(mapTo(i)))

test.serial('merge', async t => {
    const values = []
    merge(...testSource).subscribe({
        next(value) {
            values.push(value)
        },
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [1, 2, 0, 2, 0, 1])
})

test.serial('merge with concurrency', async t => {
    let values = []
    merge(...testSource, 2).subscribe({
        next(value) {
            values.push(value)
        },
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [1, 0, 0, 1, 2, 2])

    values = []
    merge(...testSource, 1).subscribe({
        next(value) {
            values.push(value)
        },
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 0, 1, 1, 2, 2])
})
