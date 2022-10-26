import test from 'ava'
import exhaustAll from '../lib/exhaustAll.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import map from '../lib/map.js'
import FakerTimers from '@sinonjs/fake-timers'
import mapTo from '../lib/mapTo.js'

const clock = FakerTimers.install()
test.after(() => clock.uninstall())

test.serial('exhaustAll', async t => {
    t.plan(2)
    const values = []
    interval(1)
        .pipe(
            map(x => interval(2).pipe(take(2), mapTo(x))),
            take(10),
            exhaustAll()
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
