import test from 'ava'
import concat from '../lib/concat.js'
import of from '../lib/of.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('concat', async t => {
    const values = []
    concat(interval(50).pipe(take(3)), of(3, 4, 5)).subscribe({
        next(value) {
            values.push(value)
        },
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [0, 1, 2, 3, 4, 5])
})
