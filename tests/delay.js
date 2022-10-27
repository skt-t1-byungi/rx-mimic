import test from 'ava'
import of from '../lib/of.js'
import delay from '../lib/delay.js'
import FakeTimers from '@sinonjs/fake-timers'
import tap from '../lib/tap.js'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('delay', async t => {
    t.plan(4)
    const values = []
    of(1, 2, 3)
        .pipe(delay(1))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
            complete: t.pass,
        })

    await clock.tickAsync(1)
    t.deepEqual(values, [1])
    await clock.tickAsync(1)
    t.deepEqual(values, [1, 2])
    await clock.tickAsync(1)
    t.deepEqual(values, [1, 2, 3])
})
