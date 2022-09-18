import test from 'ava'
import of from '../lib/of.js'
import every from '../lib/every.js'

test('every', t =>
    new Promise(end => {
        t.plan(1)
        of(1, 2, 3)
            .pipe(every(x => x < 4))
            .subscribe({
                next: x => t.is(x, true),
                complete: end,
                error: t.log,
            })
    }))

test('every, throw', t =>
    new Promise(end => {
        t.plan(1 + 2)
        of(1, 2, 3)
            .pipe(
                every(x => {
                    t.pass() // 2 times
                    return x < 2
                })
            )
            .subscribe({
                next: x => t.is(x, false),
                complete: end,
                error: t.log,
            })
    }))
