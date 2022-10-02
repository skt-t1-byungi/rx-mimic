import test from 'ava'
import audit from '../lib/audit.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('audit', async t => {
    const values = []
    interval(1)
        .pipe(
            audit(n => interval(n)),
            take(5)
        )
        .subscribe({
            next(v) {
                values.push(v)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 2, 6, 14, 30])
})
