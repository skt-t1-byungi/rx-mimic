import test from 'ava'
import mergeMap from '../lib/mergeMap.js'
import timer from '../lib/timer.js'
import take from '../lib/take.js'
import mapTo from '../lib/mapTo.js'
import concat from '../lib/concat.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

const testMapper = value =>
    [
        concat(timer(100), timer(60)),
        concat(timer(0), timer(200)),
        concat(timer(50), timer(0)),
    ][value].pipe(mapTo(value))

test.serial('mergeMap', async t => {
    const values = []
    timer(0, 50)
        .pipe(take(3), mergeMap(testMapper))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [1, 0, 2, 2, 0, 1])
})

test.serial('mergeMap with concurrency', async t => {
    let values = []
    timer(0, 50)
        .pipe(take(3), mergeMap(testMapper, 2))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [1, 0, 0, 2, 2, 1])

    values = []
    timer(0, 50)
        .pipe(take(3), mergeMap(testMapper, 1))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 0, 1, 1, 2, 2])
})
