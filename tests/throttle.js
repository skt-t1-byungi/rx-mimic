import test from 'ava'
import throttle from '../lib/throttle.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('throttle', async t => {
    t.plan(2)
    const values = []
    interval(10)
        .pipe(
            take(10),
            throttle(() => interval(10))
        )
        .subscribe({
            next(value) {
                values.push(value)
            },
            complete: t.pass,
            error: t.log,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 2, 4, 6, 8])
})
