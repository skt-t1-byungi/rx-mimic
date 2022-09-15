import test from 'ava'
import combineLatest from '../lib/combineLatest.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('combineLatest', async t => {
    t.plan(7)
    const values = []
    combineLatest(interval(10), interval(20), interval(30))
        .pipe(take(7))
        .subscribe({
            next(value) {
                values.push(value)
            },
            complete: t.pass,
            error: t.log,
        })
    await clock.tickAsync(10) // 1: 0--
    t.deepEqual(values, [])
    await clock.tickAsync(10) // 2: 10-
    t.deepEqual(values, [])
    await clock.tickAsync(10) // 3: 200
    t.deepEqual(values, [[2, 0, 0]])
    await clock.tickAsync(10) // 4: 310
    t.deepEqual(values, [
        [2, 0, 0],
        [3, 0, 0],
        [3, 1, 0],
    ])
    await clock.tickAsync(10) // 5: 410
    t.deepEqual(values, [
        [2, 0, 0],
        [3, 0, 0],
        [3, 1, 0],
        [4, 1, 0],
    ])
    await clock.tickAsync(10) // 6: 521
    t.deepEqual(values, [
        [2, 0, 0],
        [3, 0, 0],
        [3, 1, 0],
        [4, 1, 0],
        [5, 1, 0],
        [5, 2, 0],
        [5, 2, 1],
    ])
})

test.serial('combineLatest with map', async t => {
    const values = []
    combineLatest({
        a: interval(10),
        b: interval(20),
    })
        .pipe(take(4))
        .subscribe({
            next(value) {
                values.push(value)
            },
            complete: t.pass,
            error: t.log,
        })
    await clock.tickAsync(10)
    t.deepEqual(values, [])
    await clock.tickAsync(10)
    t.deepEqual(values, [{ a: 1, b: 0 }])
    await clock.tickAsync(10)
    t.deepEqual(values, [
        { a: 1, b: 0 },
        { a: 2, b: 0 },
    ])
    await clock.tickAsync(10)
    t.deepEqual(values, [
        { a: 1, b: 0 },
        { a: 2, b: 0 },
        { a: 3, b: 0 },
        { a: 3, b: 1 },
    ])
})
