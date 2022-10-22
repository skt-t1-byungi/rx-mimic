import test from 'ava'
import concatMap from '../lib/concatMap.js'
import interval from '../lib/interval.js'
import of from '../lib/of.js'
import take from '../lib/take.js'
import mapTo from '../lib/mapTo.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('concatMap', async t => {
    const values = []
    of('a', 'b', 'c')
        .pipe(concatMap(value => interval(10).pipe(take(2), mapTo(value))))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.error,
        })
    await clock.runAllAsync()
    t.deepEqual(values, ['a', 'a', 'b', 'b', 'c', 'c'])
})
