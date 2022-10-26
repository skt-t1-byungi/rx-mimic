import test from 'ava'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import exhaustMap from '../lib/exhaustMap.js'
import mapTo from '../lib/mapTo.js'
import FakerTimers from '@sinonjs/fake-timers'

const clock = FakerTimers.install()
test.after(() => clock.uninstall())

test.serial('exhaustMap', async t => {
    t.plan(2)
    const values = []
    interval(1)
        .pipe(
            take(10),
            exhaustMap(x => interval(2).pipe(take(2), mapTo(x)))
        )
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
            complete: t.pass,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 0, 5, 5])
})
