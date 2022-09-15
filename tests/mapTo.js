import test from 'ava'
import mapTo from '../lib/mapTo.js'
import of from '../lib/of.js'

test('mapTo', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3)
            .pipe(mapTo(4))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [4, 4, 4])
                    end()
                },
                error: t.log,
            })
    }))
