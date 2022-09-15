import test from 'ava'
import defaultIfEmpty from '../lib/defaultIfEmpty.js'
import EMPTY from '../lib/EMPTY.js'

test('defaultIfEmpty', t =>
    new Promise(end => {
        t.plan(1)
        EMPTY.pipe(defaultIfEmpty(100)).subscribe({
            next(value) {
                t.is(value, 100)
            },
            complete() {
                end()
            },
            error: t.log,
        })
    }))
