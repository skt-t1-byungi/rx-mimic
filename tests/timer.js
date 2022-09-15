import test from 'ava'
import timer from '../lib/timer.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('timer', async t => {
    t.plan(3)
    const values = []
    timer(50).subscribe({
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
})

test.serial('timer with interval', async t => {
    t.plan(3)
    const values = []
    timer(50, 10).subscribe({
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
    await clock.tickAsync(10)
    t.deepEqual(values, [0, 1])
})
