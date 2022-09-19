import test from 'ava'
import forkJoin from '../lib/forkJoin.js'
import of from '../lib/of.js'
import timer from '../lib/timer.js'

test('forkJoin', t =>
    new Promise(end => {
        forkJoin(of(1, 2, 3), timer(1000), Promise.resolve(100)).subscribe({
            next(value) {
                t.deepEqual(value, [3, 0, 100])
            },
            complete() {
                end()
            },
            error: t.log,
        })
    }))

test('forkJoin with map', t =>
    new Promise(end => {
        forkJoin({
            a: of(1, 2, 3),
            b: timer(1000),
            c: Promise.resolve(100),
        }).subscribe({
            next(value) {
                t.deepEqual(value, { a: 3, b: 0, c: 100 })
            },
            complete() {
                end()
            },
            error: t.log,
        })
    }))
