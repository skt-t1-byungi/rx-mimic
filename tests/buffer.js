import test from 'ava'
import interval from '../lib/interval.js'
import buffer from '../lib/buffer.js'
import timer from '../lib/timer.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('buffer', async t => {
    t.plan(2)
    const values = []
    interval(10)
        .pipe(take(6), buffer(timer(20, 30)))
        .subscribe({
            next(value) {
                values.push(value)
            },
            complete: t.pass,
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [[0, 1], [2, 3, 4], [5]])
})
