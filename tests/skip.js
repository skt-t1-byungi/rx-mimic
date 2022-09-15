import test from 'ava'
import of from '../lib/of.js'
import skip from '../lib/skip.js'

test('skip', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3, 4, 5, 6)
            .pipe(skip(3))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [4, 5, 6])
                    end()
                },
                error: t.log,
            })
    }))
