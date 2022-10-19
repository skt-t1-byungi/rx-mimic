import test from 'ava'
import bufferWhen from '../lib/bufferWhen.js'
import interval from '../lib/interval.js'
import timer from '../lib/timer.js'
import FakeTimers from '@sinonjs/fake-timers'
import take from '../lib/take.js'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('bufferWhen', async t => {
    const values = []
    interval(2)
        .pipe(
            take(6),
            bufferWhen(() => timer(5))
        )
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [[0, 1], [2, 3, 4], [5]])
})
