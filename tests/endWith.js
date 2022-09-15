import test from 'ava'
import endWith from '../lib/endWith.js'
import of from '../lib/of.js'

test('endWith', t =>
    new Promise(end => {
        const values = []
        of(1)
            .pipe(endWith(2, 3))
            .subscribe({
                next(v) {
                    values.push(v)
                },
                complete() {
                    t.deepEqual(values, [1, 2, 3])
                    end()
                },
            })
    }))
