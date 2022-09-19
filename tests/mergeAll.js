import test from 'ava'
import mergeAll from '../lib/mergeAll.js'
import from from '../lib/from.js'
import timer from '../lib/timer.js'
import concat from '../lib/concat.js'
import FakeTimers from '@sinonjs/fake-timers'
import mapTo from '../lib/mapTo.js'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

const testSource = from(
    [
        concat(timer(100), timer(50)),
        concat(timer(0), timer(200)),
        concat(timer(50), timer(50)),
    ].map((src, i) => src.pipe(mapTo(i)))
)

test.serial('mergeAll', async t => {
    const values = []
    testSource.pipe(mergeAll()).subscribe({
        next(value) {
            values.push(value)
        },
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [1, 2, 0, 2, 0, 1])
})

test.serial('mergeAll with concurrency', async t => {
    let values = []
    testSource.pipe(mergeAll(2)).subscribe({
        next(value) {
            values.push(value)
        },
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [1, 0, 0, 1, 2, 2])

    values = []
    testSource.pipe(mergeAll(1)).subscribe({
        next(value) {
            values.push(value)
        },
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 0, 1, 1, 2, 2])
})
