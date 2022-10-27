import test from 'ava'
import switchMap from '../lib/switchMap.js'
import timer from '../lib/timer.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import mapTo from '../lib/mapTo.js'
import FakeTimers from '@sinonjs/fake-timers'
import concat from '../lib/concat.js'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('switchMap', async t => {
    t.plan(2)
    const values = []
    concat('a', timer(3).pipe(mapTo('b')), timer(2).pipe(mapTo('c')))
        .pipe(
            switchMap(x => interval(1).pipe(mapTo(x))),
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
    t.deepEqual(values, ['a', 'a', 'a', 'b', 'b', 'c'])
})
