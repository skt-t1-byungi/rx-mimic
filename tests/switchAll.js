import test from 'ava'
import switchAll from '../lib/switchAll.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import map from '../lib/map.js'
import mapTo from '../lib/mapTo.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('switchAll', async t => {
    t.plan(2)
    const values = []
    interval(2)
        .pipe(
            take(3),
            map(x => interval(1).pipe(take(3), mapTo(x))),
            switchAll()
        )
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.log,
            complete: t.pass,
        })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 1, 2, 2, 2])
})
