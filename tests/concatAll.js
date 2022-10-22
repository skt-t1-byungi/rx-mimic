import test from 'ava'
import concatAll from '../lib/concatAll.js'
import interval from '../lib/interval.js'
import of from '../lib/of.js'
import take from '../lib/take.js'
import mapTo from '../lib/mapTo.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('concatAll', async t => {
    const values = []
    of(
        interval(30).pipe(take(2), mapTo('a')),
        of('b'),
        interval(20).pipe(take(3), mapTo('c'))
    )
        .pipe(concatAll())
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.error,
        })
    await clock.runAllAsync()
    t.deepEqual(values, ['a', 'a', 'b', 'c', 'c', 'c'])
})
