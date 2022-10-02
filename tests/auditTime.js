import test from 'ava'
import auditTime from '../lib/auditTime.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('auditTime', async t => {
    const values = []
    interval(1)
        .pipe(auditTime(4), take(5))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [4, 9, 14, 19, 24])
})
