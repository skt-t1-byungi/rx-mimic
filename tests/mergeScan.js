import test from 'ava'
import mergeScan from '../lib/mergeScan.js'
import interval from '../lib/interval.js'
import mapTo from '../lib/mapTo.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('mergeScan', async t => {
    const values = []
    interval(1)
        .pipe(
            mergeScan((acc, x) => interval(2).pipe(take(3), mapTo(acc + x)), 0),
            take(6)
        )
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
            complete: t.pass,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 1, 0, 2, 1, 3])
})
