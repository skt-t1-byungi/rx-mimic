import test from 'ava'
import switchScan from '../lib/switchScan.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import mapTo from '../lib/mapTo.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('switchScan', async t => {
    const values = []
    interval(3)
        .pipe(
            switchScan((acc, x) => interval(1).pipe(mapTo(acc + x)), 0),
            take(10)
        )
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.error,
            complete: t.pass,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 0, 1, 1, 3, 3, 6, 6, 10, 10])
})
