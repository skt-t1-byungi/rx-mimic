import test from 'ava'
import concatWith from '../lib/concatWith.js'
import interval from '../lib/interval.js'
import of from '../lib/of.js'
import take from '../lib/take.js'
import mapTo from '../lib/mapTo.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('concatWith', async t => {
    const values = []
    of('a')
        .pipe(concatWith(interval(30).pipe(take(2), mapTo('b')), of('c')))
        .subscribe({
            next(value) {
                values.push(value)
            },
            error: t.error,
        })
    await clock.runAllAsync()
    t.deepEqual(values, ['a', 'b', 'b', 'c'])
})
