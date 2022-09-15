import test from 'ava'
import throwIfEmpty from '../lib/throwIfEmpty.js'
import EMPTY from '../lib/EMPTY.js'

test('throwIfEmpty', t =>
    new Promise(end => {
        const error = new Error('foo')
        EMPTY.pipe(throwIfEmpty(() => error)).subscribe({
            next: t.fail,
            complete: t.fail,
            error(err) {
                t.is(err, error)
                end()
            },
        })
    }))
