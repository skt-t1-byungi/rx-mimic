import test from 'ava'
import { EventEmitter } from 'node:events'
import take from '../lib/take.js'
import fromEvent from '../lib/fromEvent.js'

test('fromEvent', t =>
    new Promise(end => {
        t.plan(2)
        const emitter = new EventEmitter()
        const values = []
        emitter.removeListener = (...args) => {
            emitter.off(...args)
            t.pass()
        }
        fromEvent(emitter, 'test')
            .pipe(take(3))
            .subscribe({
                next(value) {
                    values.push(value)
                },
                complete() {
                    t.deepEqual(values, [1, 2, 3])
                    end()
                },
                error: t.log,
            })
        emitter.emit('test', 1)
        emitter.emit('test', 2)
        setTimeout(() => emitter.emit('test', 3), 50)
    }))
