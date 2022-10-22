import test from 'ava'
import toArray from '../lib/toArray.js'
import of from '../lib/of.js'

test('toArray', t =>
    new Promise(end => {
        of(1, 2, 3)
            .pipe(toArray())
            .subscribe({
                next(value) {
                    t.deepEqual(value, [1, 2, 3])
                },
                complete: end,
                error: t.log,
            })
    }))
