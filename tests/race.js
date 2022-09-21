import test from 'ava'
import race from '../lib/race.js'
import timer from '../lib/timer.js'
import mapTo from '../lib/mapTo.js'
import FakeTimers from '@sinonjs/fake-timers'
import take from '../lib/take.js'

const clock = FakeTimers.install()
test.after(() => clock.uninstall())

test('race', async t => {
    race(
        timer(300, 10).pipe(mapTo('a')),
        timer(50, 500).pipe(mapTo('b')),
        timer(200, 100).pipe(mapTo('c'))
    )
        .pipe(take(3))
        .subscribe({
            next(value) {
                t.is(value, 'b')
            },
        })
    await clock.runAllAsync()
})
