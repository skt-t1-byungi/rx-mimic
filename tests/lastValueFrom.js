import test from 'ava'
import lastValueFrom from '../lib/lastValueFrom.js'
import interval from '../lib/interval.js'
import take from '../lib/take.js'
import EMPTY from '../lib/EMPTY.js'

test('lastValueFrom', async t => {
    t.is(await lastValueFrom(interval(1).pipe(take(3))), 2)
})

test('lastValueFrom with default', async t => {
    t.is(await lastValueFrom(EMPTY, { defaultValue: 100 }), 100)
})

test('if no value, throw error', async t => {
    await t.throwsAsync(lastValueFrom(EMPTY))
})
