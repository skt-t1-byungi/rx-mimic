import test from 'ava'
import map from '../lib/map.js'
import of from '../lib/of.js'

test('map', t =>
    new Promise(end => {
        const values = []
        of(1, 2, 3)
            .pipe(map(x => x * 2))
            .subscribe({
                next(x) {
                    values.push(x)
                },
                complete() {
                    t.deepEqual(values, [2, 4, 6])
                    end()
                },
            })
    }))
