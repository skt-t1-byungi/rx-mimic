import test from 'ava'
import takeUntil from '../lib/takeUntil.js'
import interval from '../lib/interval.js'
import timer from '../lib/timer.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('takeUntil', async t => {
    t.plan(5)
    const values = []
    interval(50)
        .pipe(takeUntil(timer(100)))
        .subscribe({
            next(value) {
                values.push(value)
            },
            complete: t.pass,
            error: t.log,
        })
    await clock.tickAsync(40)
    t.deepEqual(values, [])
    await clock.tickAsync(10)
    t.deepEqual(values, [0])
    await clock.tickAsync(50)
    t.deepEqual(values, [0, 1])
    await clock.tickAsync(50)
    t.deepEqual(values, [0, 1])
})
