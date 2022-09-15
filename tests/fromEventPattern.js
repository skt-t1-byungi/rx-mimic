import test from 'ava'
import fromEventPattern from '../lib/fromEventPattern.js'
import { EventEmitter } from 'node:events'
import take from '../lib/take.js'

test('fromEventPattern', t =>
    new Promise(end => {
        const emitter = new EventEmitter()
        const values = []
        fromEventPattern(
            handler => emitter.on('test', handler),
            handler => emitter.off('test', handler)
        )
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
