import test from 'ava'
import bufferToggle from '../lib/bufferToggle.js'
import interval from '../lib/interval.js'
import timer from '../lib/timer.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('bufferToggle', async t => {
    const values = []
    interval(1)
        .pipe(
            take(14),
            bufferToggle(interval(3), n => timer(n * 2))
        )
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [[2], [5, 6, 7], [8, 9, 10, 11, 12], [11, 12, 13]])
})
