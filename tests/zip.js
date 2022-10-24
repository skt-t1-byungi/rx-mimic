import test from 'ava'
import zip from '../lib/zip.js'
import of from '../lib/of.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test('zip', async t => {
    t.plan(2)
    const values = []
    zip(of('a', 'b', 'c'), interval(100).pipe(take(3))).subscribe({
        next(value) {
            values.push(value)
        },
        complete: t.pass,
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [
        ['a', 0],
        ['b', 1],
        ['c', 2],
    ])
})
