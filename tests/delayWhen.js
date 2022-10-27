import test from 'ava'
import delayWhen from '../lib/delayWhen.js'
import timer from '../lib/timer.js'
import of from '../lib/of.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('delayWhen', async t => {
    const values = []
    of(1, 2, 3)
        .pipe(delayWhen(n => timer(4 - n)))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
            complete: t.pass,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [3, 2, 1])
})
