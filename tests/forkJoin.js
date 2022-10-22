import test from 'ava'
import forkJoin from '../lib/forkJoin.js'
import of from '../lib/of.js'
import timer from '../lib/timer.js'
import FakeTimers from '@sinonjs/fake-timers'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test.serial('forkJoin', async t => {
    const values = []
    forkJoin(of(1, 2, 3), timer(1000), Promise.resolve(100)).subscribe({
        next(value) {
            values.push(value)
        },
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [[3, 0, 100]])
})

test.serial('forkJoin with map', async t => {
    const values = []
    forkJoin({
        a: of(1, 2, 3),
        b: timer(1000),
        c: Promise.resolve(100),
    }).subscribe({
        next(value) {
            values.push(value)
        },
        error: t.log,
    })
    await clock.runAllAsync()
    t.deepEqual(values, [{ a: 3, b: 0, c: 100 }])
})
