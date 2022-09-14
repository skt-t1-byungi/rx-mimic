import test from 'ava'
import of from '../lib/of.js'
import catchError from '../lib/catchError.js'
import EMPTY from '../lib/EMPTY.js'

test('return observable', t =>
    new Promise(end => {
        const values = []
        of(Promise.reject('error'))
            .pipe(
                catchError(reason => {
                    t.is(reason, 'error')
                    return of(1, 2, 3)
                })
            )
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [1, 2, 3])
                    end()
                },
            })
    }))

test('retry by caught', t =>
    new Promise(end => {
        let count = 0
        const values = []
        of(1, 2, Promise.reject('error'))
            .pipe(
                catchError((_, caught) => {
                    return count++ < 2 ? caught : EMPTY
                })
            )
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [1, 2, 1, 2, 1, 2])
                    end()
                },
            })
    }))
